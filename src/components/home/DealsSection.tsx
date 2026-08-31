import { Link } from "@tanstack/react-router";
import { Tag, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/models/Product";
import { discountPercent } from "@/models/Product";

export function DealsSection({ products }: { products: Product[] }) {
  // Filter products that have a real discount in the database
  const discountedProducts = products
    .filter(
      (p) =>
        p.compareAtPrice !== null && p.compareAtPrice > p.price && p.stockStatus !== "out_of_stock",
    )
    .sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0));

  if (discountedProducts.length === 0) return null;

  const maxDiscount = Math.max(...discountedProducts.map((p) => discountPercent(p) ?? 0));
  const featuredDeals = discountedProducts.slice(0, 4);

  return (
    <section
      id="deals"
      className="py-12 sm:py-16 border-b border-border/60 bg-gradient-to-b from-surface/40 via-background to-background relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <Container>
        {/* Deal Header Banner */}
        <div className="mb-8 rounded-sm border border-primary/40 bg-surface p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-xs bg-primary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/30">
                <Tag className="h-3 w-3" />
                <span>LIMITED TIME OFFERS</span>
              </div>
              <h2 className="display-title mt-3 text-3xl sm:text-5xl md:text-6xl text-foreground leading-none">
                DEALS OF THE WEEK
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Save <span className="font-bold text-primary">up to {maxDiscount}% OFF</span> on
                selected equipment, footwear and match gear.
              </p>
            </div>

            <Link to="/offers">
              <Button size="lg" className="h-12 px-7 text-xs font-bold tracking-widest shrink-0">
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span>SHOP DEALS</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featuredDeals.map((product) => (
            <ProductCard key={product.id} product={product} showWhatsAppAction={true} />
          ))}
        </div>
      </Container>
    </section>
  );
}
