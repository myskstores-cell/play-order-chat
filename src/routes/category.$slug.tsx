import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categoriesApi";
import { Container, PageHeader } from "@/components/common/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import {
  EmptyState,
  ErrorState,
  ProductGridSkeleton,
} from "@/components/common/States";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ")} — SK Sport Store`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Shop ${params.slug.replace(/-/g, " ")} at SK Sport Store and order on WhatsApp.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Category products at SK Sport Store.",
        },
      ],
    };
  },
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const { slug } = Route.useParams();

  const category = useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.bySlug(slug),
  });
  const products = useQuery({
    queryKey: ["category", slug, "products"],
    queryFn: () => categoriesApi.products(slug),
  });

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={category.data?.name ?? slug.replace(/-/g, " ")}
        description={category.data?.description ?? undefined}
      />
      <Container className="py-10">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Categories", to: "/categories" },
            { label: category.data?.name ?? slug },
          ]}
        />
        <div className="mt-8">
          {products.isLoading ? (
            <ProductGridSkeleton />
          ) : products.isError ? (
            <ErrorState onRetry={() => products.refetch()} />
          ) : (products.data ?? []).length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              message="This category has no products right now. Check back soon."
            />
          ) : (
            <ProductGrid products={products.data ?? []} />
          )}
        </div>
      </Container>
    </>
  );
}
