import { Link } from "@tanstack/react-router";
import type { Product } from "@/models/Product";
import { discountPercent } from "@/models/Product";
import { formatPrice, stockLabel } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="surface-panel group flex flex-col overflow-hidden rounded-sm transition-colors hover:border-primary/60"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-strong">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {discount && (
          <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
            -{discount}%
          </span>
        )}
        {product.stockStatus === "out_of_stock" && (
          <span className="absolute right-2 top-2 rounded-sm bg-background/90 px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand && <p className="eyebrow">{product.brand}</p>}
        <h3 className="text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {stockLabel(product.stockStatus)}
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
