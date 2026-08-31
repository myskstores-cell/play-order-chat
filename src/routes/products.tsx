import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/productsApi";
import { categoriesApi } from "@/api/categoriesApi";
import { Container, PageHeader } from "@/components/common/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/common/States";
import { SearchBar } from "@/components/navigation/SearchBar";
import { Layers, X } from "lucide-react";
import type { ProductSort } from "@/models/Product";

interface ProductsSearch {
  q?: string | undefined;
  category?: string | undefined;
  sort?: ProductSort | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
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
    q: typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined,
    category:
      typeof search["category"] === "string" && search["category"]
        ? (search["category"] as string)
        : undefined,
    sort: SORTS.some((s) => s.value === search["sort"])
      ? (search["sort"] as ProductSort)
      : undefined,
    minPrice:
      typeof search["minPrice"] === "number"
        ? (search["minPrice"] as number)
        : typeof search["minPrice"] === "string" && !isNaN(Number(search["minPrice"]))
          ? Number(search["minPrice"])
          : undefined,
    maxPrice:
      typeof search["maxPrice"] === "number"
        ? (search["maxPrice"] as number)
        : typeof search["maxPrice"] === "string" && !isNaN(Number(search["maxPrice"]))
          ? Number(search["maxPrice"])
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
  const { q, category, sort, minPrice, maxPrice } = Route.useSearch();
  const navigate = Route.useNavigate();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const products = useQuery({
    queryKey: ["products", { q, category, sort, minPrice, maxPrice }],
    queryFn: () => {
      const filters: Parameters<typeof productsApi.filter>[0] = {};
      if (q) filters.search = q;
      if (category) filters.categorySlug = category;
      if (minPrice !== undefined) filters.minPrice = minPrice;
      if (maxPrice !== undefined) filters.maxPrice = maxPrice;
      return productsApi.filter(filters, sort ?? "featured");
    },
  });

  const list = products.data ?? [];
  const categoriesList = categoriesQuery.data ?? [];
  const activeCategory = categoriesList.find((c) => c.slug === category);

  function handleSelectCategory(catSlug?: string) {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        category: catSlug || undefined,
      }),
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={
          activeCategory ? activeCategory.name : q ? `Results for “${q}”` : "All Sports & Gear"
        }
        description="Browse premium sports equipment, footwear, and accessories. Filter by sport category and order via WhatsApp."
      />

      <Container className="py-8">
        {/* SEPARATE CATEGORY SELECTOR SECTION */}
        <div className="mb-8 rounded-sm border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Select Sport Category
              </span>
            </div>
            {category && (
              <button
                type="button"
                onClick={() => handleSelectCategory(undefined)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive hover:underline"
              >
                <X className="h-3 w-3" /> Clear Category Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectCategory(undefined)}
              className={`rounded-xs px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                !category
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                  : "border border-border/80 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-surface"
              }`}
            >
              All Sports
            </button>

            {categoriesList.map((cat) => {
              const isSelected = category === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`rounded-xs px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                      : "border border-border/80 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH AND SORT BAR */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <SearchBar className="w-full sm:max-w-sm" initialValue={q ?? ""} />

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Showing {list.length} item{list.length === 1 ? "" : "s"}
            </span>

            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                className="rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {products.isLoading ? (
          <ProductGridSkeleton />
        ) : products.isError ? (
          <ErrorState onRetry={() => products.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState
            title="No products found"
            message={
              category
                ? `No products found in "${activeCategory?.name || category}". Try selecting "All Sports" or a different category.`
                : "Try a different search term or browse all categories."
            }
          />
        ) : (
          <ProductGrid products={list} />
        )}
      </Container>
    </>
  );
}
