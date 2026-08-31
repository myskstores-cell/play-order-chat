import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/States";
import type { Product } from "@/models/Product";

export function NewArrivals({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 border-b border-border/60 bg-surface/30">
      <Container>
        <SectionHeader
          eyebrow="JUST IN"
          title="NEW ARRIVALS"
          description="Fresh gear recently added to the store."
          action={
            <Link
              to="/products"
              search={{ sort: "newest" }}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary hover:underline"
            >
              <span>VIEW ALL NEW</span>
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
