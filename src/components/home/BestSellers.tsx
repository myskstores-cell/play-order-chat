import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/States";
import type { Product } from "@/models/Product";
import { useBestSellersConfig } from "@/services/homepageSettingsService";

export function BestSellers({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  const config = useBestSellersConfig();

  const displayProducts = useMemo(() => {
    if (config.productIds && config.productIds.length > 0) {
      const mapped = config.productIds
        .map((idOrSlug) => products.find((p) => p.id === idOrSlug || p.slug === idOrSlug))
        .filter((p): p is Product => !!p);
      if (mapped.length > 0) {
        return mapped.slice(0, 4);
      }
    }
    return products.slice(0, 4);
  }, [config.productIds, products]);

  return (
    <section className="py-12 sm:py-16 border-b border-border/60 bg-surface/30">
      <Container>
        <SectionHeader
          eyebrow={config.eyebrow || "POPULAR EQUIPMENT"}
          title={config.title || "BEST SELLERS"}
          description={config.description || "Popular picks from SK Sport Store."}
          action={
            <Link
              to="/products"
              search={{ sort: "featured" }}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary hover:underline"
            >
              <span>Explore All Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <ProductGrid products={displayProducts} showWhatsAppAction={true} />
        )}
      </Container>
    </section>
  );
}

