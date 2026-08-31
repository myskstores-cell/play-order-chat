import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";
import { CategoryCard } from "@/components/product/CategoryCard";
import type { Category } from "@/models/Category";
import { ProductGridSkeleton } from "@/components/common/States";

const PRIMARY_SPORT_SLUGS = [
  "cricket",
  "football",
  "badminton",
  "tennis",
  "basketball",
  "running",
  "fitness-gym",
  "sports-shoes",
];

export function ShopBySport({
  categories,
  isLoading,
}: {
  categories: Category[];
  isLoading: boolean;
}) {
  // Show exactly the 3 featured categories chosen via Sort Order in the Admin Panel
  const topCategories = categories.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 border-b border-border/60">
      <Container>
        <SectionHeader
          eyebrow="CHOOSE YOUR GAME"
          title="SHOP BY SPORT"
          description="Find premium equipment, footwear, and accessories tailored for your sport."
          action={
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary hover:underline"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        {isLoading ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            {topCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
