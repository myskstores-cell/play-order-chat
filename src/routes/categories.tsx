import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categoriesApi";
import { Container, PageHeader } from "@/components/common/Section";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ErrorState, ProductGridSkeleton } from "@/components/common/States";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Shop by Category — SK Sport Store" },
      {
        name: "description",
        content:
          "Cricket, football, badminton, tennis, basketball, running, fitness, footwear, apparel and accessories at SK Sport Store.",
      },
      { property: "og:title", content: "Shop by Category — SK Sport Store" },
      {
        property: "og:description",
        content: "Browse every sports category stocked at SK Sport Store.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Categories"
        description="Find gear faster by sport and product type."
      />
      <Container className="py-10">
        {categories.isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : categories.isError ? (
          <ErrorState onRetry={() => categories.refetch()} />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(categories.data ?? []).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
