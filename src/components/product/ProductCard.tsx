import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Product } from "@/models/Product";
import { discountPercent } from "@/models/Product";
import { formatPrice, stockLabel } from "@/lib/format";
import { whatsappService } from "@/services/whatsappService";

export interface ProductCardProps {
  product: Product;
  showWhatsAppAction?: boolean;
}

export function ProductCard({ product, showWhatsAppAction = true }: ProductCardProps) {
  const discount = discountPercent(product);
  const isInStock = product.stockStatus === "in_stock";
  const isLowStock = product.stockStatus === "low_stock";
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const waMessage = whatsappService.buildDirectProductOrderMessage({
    id: product.id,
    sku: product.sku,
    name: product.name,
    price: product.price,
    brand: product.brand,
    size: product.size,
    sport: product.sport,
  }, 1);
  const waUrl = whatsappService.generateWhatsAppUrl(waMessage);

  return (
    <div className="surface-panel group relative flex flex-col overflow-hidden rounded-sm border border-border/80 bg-surface transition-all duration-200 hover:border-primary/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
      {/* Product Image Container */}
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-surface-strong"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-strong text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">No Image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-xs bg-primary px-2 py-0.5 text-[11px] font-black tracking-tight text-primary-foreground shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Stock Badge on Top Right */}
        {isOutOfStock ? (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-xs bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
            Sold out
          </span>
        ) : isLowStock ? (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-xs bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30 backdrop-blur-xs">
            Low Stock
          </span>
        ) : null}
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Brand & Category Snippet */}
        <div className="mb-1 flex items-center justify-between gap-2">
          {product.brand ? (
            <span className="eyebrow text-[10px] font-bold tracking-[0.2em] text-primary">
              {product.brand}
            </span>
          ) : product.sport ? (
            <span className="eyebrow text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
              {product.sport}
            </span>
          ) : null}

          {/* Stock indicator badge */}
          {isInStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-primary">
              <CheckCircle2 className="h-3 w-3" />
              IN STOCK
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link to="/product/$slug" params={{ slug: product.slug }} className="group/title block">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover/title:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-foreground sm:text-lg">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {showWhatsAppAction && (
          <div className="mt-4 flex flex-col gap-2 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xs bg-whatsapp px-3 text-xs font-bold uppercase tracking-wider text-whatsapp-foreground transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Order on WhatsApp</span>
            </a>

            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-xs border border-border/80 bg-surface-strong/60 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/40 hover:bg-surface-strong hover:text-foreground"
            >
              <span>View Product</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  showWhatsAppAction = true,
}: {
  products: Product[];
  showWhatsAppAction?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showWhatsAppAction={showWhatsAppAction} />
      ))}
    </div>
  );
}
