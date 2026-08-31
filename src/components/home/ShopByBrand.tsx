import { Link } from "@tanstack/react-router";
import { ArrowRight, Award } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";
import type { Product } from "@/models/Product";

export function ShopByBrand({ products }: { products: Product[] }) {
  // Derive unique brands from actual inventory
  const brandMap = new Map<string, { count: number; sports: Set<string> }>();

  for (const product of products) {
    if (product.brand) {
      const existing = brandMap.get(product.brand) ?? {
        count: 0,
        sports: new Set<string>(),
      };
      existing.count += 1;
      if (product.sport) existing.sports.add(product.sport);
      brandMap.set(product.brand, existing);
    }
  }

  const brands = Array.from(brandMap.entries()).map(([name, meta]) => ({
    name,
    count: meta.count,
    sports: Array.from(meta.sports).slice(0, 2).join(" • "),
  }));

  // Hide section gracefully if no brand data exists
  if (brands.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-b border-border/60">
      <Container>
        <SectionHeader
          eyebrow="EQUIPMENT MAKERS"
          title="SHOP BY BRAND"
          description="Specialized sports brands stocked in our store."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to="/products"
              search={{ q: brand.name }}
              className="group flex flex-col justify-between rounded-sm border border-border/80 bg-surface p-4 text-center transition-all duration-200 hover:border-primary hover:bg-surface-strong hover:shadow-lg"
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xs bg-surface-strong border border-border/60 text-primary group-hover:border-primary/50">
                <Award className="h-5 w-5" />
              </div>

              <div>
                <h3 className="display-title text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                {brand.sports && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider line-clamp-1">
                    {brand.sports}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary opacity-80 group-hover:opacity-100">
                <span>
                  {brand.count} {brand.count === 1 ? "Product" : "Products"}
                </span>
                <ArrowRight className="h-2.5 w-2.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
