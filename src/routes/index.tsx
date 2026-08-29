import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/productsApi";
import { categoriesApi } from "@/api/categoriesApi";
import { Container, SectionHeader } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { ProductGrid } from "@/components/product/ProductCard";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ErrorState, ProductGridSkeleton } from "@/components/common/States";
import { config } from "@/config/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SK Sport Store — Sports Gear, Shoes & Apparel" },
      {
        name: "description",
        content:
          "Browse cricket, football, badminton, fitness gear, shoes and apparel at SK Sport Store. Order easily on WhatsApp — no online payment.",
      },
      { property: "og:title", content: "SK Sport Store — Sports Gear, Shoes & Apparel" },
      {
        property: "og:description",
        content: "Shop sports equipment and apparel. Place your order on WhatsApp.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.featured(8),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/images/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <Container className="relative py-20 sm:py-28">
          <p className="eyebrow mb-3">{config.store.tagline}</p>
          <h1 className="display-title max-w-3xl text-4xl sm:text-6xl">
            Gear up at SK Sport Store
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            {config.store.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products">
              <Button size="lg">Shop all products</Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline">
                Browse categories
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeader
          eyebrow="Shop by sport"
          title="Categories"
          action={
            <Link to="/categories" className="text-xs font-semibold uppercase tracking-wider text-primary">
              View all
            </Link>
          }
        />
        {categories.isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : categories.isError ? (
          <ErrorState onRetry={() => categories.refetch()} />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(categories.data ?? []).slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Container>

      <Container className="pb-20">
        <SectionHeader
          eyebrow="Handpicked"
          title="Featured products"
          description="Popular picks in store right now."
        />
        {featured.isLoading ? (
          <ProductGridSkeleton />
        ) : featured.isError ? (
          <ErrorState onRetry={() => featured.refetch()} />
        ) : (
          <ProductGrid products={featured.data ?? []} />
        )}
      </Container>
    </>
  );
}
