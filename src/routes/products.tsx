import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/productsApi";
import { Container, PageHeader } from "@/components/common/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import {
  EmptyState,
  ErrorState,
  ProductGridSkeleton,
} from "@/components/common/States";
import { SearchBar } from "@/components/navigation/SearchBar";
import type { ProductSort } from "@/models/Product";

interface ProductsSearch {
  q?: string;
  sort?: ProductSort;
}

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name A–Z" },
];

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    sort: SORTS.some((s) => s.value === search.sort)
      ? (search.sort as ProductSort)
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All Products — SK Sport Store" },
      {
        name: "description",
        content:
          "Browse the full SK Sport Store catalog: equipment, footwear, apparel and accessories across every sport.",
      },
      { property: "og:title", content: "All Products — SK Sport Store" },
      {
        property: "og:description",
        content: "Browse the full SK Sport Store catalog and order on WhatsApp.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  const products = useQuery({
    queryKey: ["products", { q, sort }],
    queryFn: () => productsApi.filter({ search: q }, sort ?? "featured"),
  });

  const list = products.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={q ? `Results for “${q}”` : "All products"}
        description="Everything in store. Add items to your cart and finish the order on WhatsApp."
      />
      <Container className="py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <SearchBar className="w-full sm:max-w-sm" initialValue={q ?? ""} />
          <label className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sort
            <select
              value={sort ?? "featured"}
              onChange={(event) =>
                navigate({
                  to: ".",
                  search: (prev) => ({
                    ...prev,
                    sort: event.target.value as ProductSort,
                  }),
                })
              }
              className="rounded-sm border border-input bg-background px-2 py-2 text-xs text-foreground"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {products.isLoading ? (
          <ProductGridSkeleton />
        ) : products.isError ? (
          <ErrorState onRetry={() => products.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState
            title="No products found"
            message="Try a different search term or browse all categories."
          />
        ) : (
          <ProductGrid products={list} />
        )}
      </Container>
    </>
  );
}
