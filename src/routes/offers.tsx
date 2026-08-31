import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tag, Sparkles, Flame, Percent, ArrowRight, Filter, ShoppingBag } from "lucide-react";
import { productsApi } from "@/api/productsApi";
import { categoriesApi } from "@/api/categoriesApi";
import { Container, PageHeader } from "@/components/common/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState, ProductGridSkeleton } from "@/components/common/States";
import { Button } from "@/components/common/Button";
import { discountPercent, type Product } from "@/models/Product";
import { formatPrice } from "@/lib/format";

type DealTier = "all" | "50plus" | "30to50" | "20to30" | "under999" | "cricket" | "shoes" | "fitness";
type SortOption = "highest-discount" | "price-asc" | "price-desc" | "newest";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Clearance Deals | SK Sport Store" },
      {
        name: "description",
        content:
          "Shop discounted cricket gear, footballs, badminton rackets, and sports shoes at SK Sport Store. Save up to 60% OFF and order on WhatsApp.",
      },
      { property: "og:title", content: "Offers & Clearance Deals | SK Sport Store" },
      {
        property: "og:description",
        content: "Explore exclusive sports equipment deals and discount offers.",
      },
    ],
  }),
  component: OffersPage,
});

export function OffersPage() {
  const [selectedTier, setSelectedTier] = useState<DealTier>("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("highest-discount");

  const productsQuery = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsApi.list(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const allProducts = productsQuery.data ?? [];

  // Filter products that have an active discount (compareAtPrice > price)
  const allDeals = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.compareAtPrice !== null &&
        p.compareAtPrice > p.price &&
        p.stockStatus !== "out_of_stock",
    );
  }, [allProducts]);

  // Max discount available across the catalog
  const maxDiscount = useMemo(() => {
    if (allDeals.length === 0) return 0;
    return Math.max(...allDeals.map((p) => discountPercent(p) ?? 0));
  }, [allDeals]);

  // Filter by selected tier
  const filteredDeals = useMemo(() => {
    let list = [...allDeals];

    switch (selectedTier) {
      case "50plus":
        list = list.filter((p) => (discountPercent(p) ?? 0) >= 50);
        break;
      case "30to50":
        list = list.filter((p) => {
          const d = discountPercent(p) ?? 0;
          return d >= 30 && d < 50;
        });
        break;
      case "20to30":
        list = list.filter((p) => {
          const d = discountPercent(p) ?? 0;
          return d >= 20 && d < 30;
        });
        break;
      case "under999":
        list = list.filter((p) => p.price < 999);
        break;
      case "cricket":
        list = list.filter(
          (p) =>
            p.sport?.toLowerCase() === "cricket" ||
            p.categorySlug === "cricket" ||
            p.name.toLowerCase().includes("cricket"),
        );
        break;
      case "shoes":
        list = list.filter(
          (p) =>
            p.categorySlug === "sports-shoes" ||
            p.name.toLowerCase().includes("shoe") ||
            p.name.toLowerCase().includes("boots"),
        );
        break;
      case "fitness":
        list = list.filter(
          (p) =>
            p.categorySlug === "fitness-gym" ||
            p.sport?.toLowerCase() === "fitness" ||
            p.name.toLowerCase().includes("dumbbell") ||
            p.name.toLowerCase().includes("mat"),
        );
        break;
      case "all":
      default:
        break;
    }

    // Sort
    switch (selectedSort) {
      case "highest-discount":
        return list.sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0));
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "newest":
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      default:
        return list;
    }
  }, [allDeals, selectedTier, selectedSort]);

  const dealTiers: { id: DealTier; label: string; count?: number; badge?: string }[] = [
    { id: "all", label: "All Deals", count: allDeals.length },
    {
      id: "50plus",
      label: "50%+ OFF",
      badge: "MEGA",
      count: allDeals.filter((p) => (discountPercent(p) ?? 0) >= 50).length,
    },
    {
      id: "30to50",
      label: "30% – 50% OFF",
      count: allDeals.filter((p) => {
        const d = discountPercent(p) ?? 0;
        return d >= 30 && d < 50;
      }).length,
    },
    {
      id: "20to30",
      label: "20% – 30% OFF",
      count: allDeals.filter((p) => {
        const d = discountPercent(p) ?? 0;
        return d >= 20 && d < 30;
      }).length,
    },
    {
      id: "under999",
      label: "Under ₹999",
      count: allDeals.filter((p) => p.price < 999).length,
    },
    {
      id: "cricket",
      label: "Cricket Offers",
      count: allDeals.filter(
        (p) =>
          p.sport?.toLowerCase() === "cricket" ||
          p.categorySlug === "cricket" ||
          p.name.toLowerCase().includes("cricket"),
      ).length,
    },
    {
      id: "shoes",
      label: "Footwear Deals",
      count: allDeals.filter(
        (p) =>
          p.categorySlug === "sports-shoes" ||
          p.name.toLowerCase().includes("shoe") ||
          p.name.toLowerCase().includes("boots"),
      ).length,
    },
    {
      id: "fitness",
      label: "Gym & Fitness",
      count: allDeals.filter(
        (p) =>
          p.categorySlug === "fitness-gym" ||
          p.sport?.toLowerCase() === "fitness" ||
          p.name.toLowerCase().includes("dumbbell") ||
          p.name.toLowerCase().includes("mat"),
      ).length,
    },
  ];

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Deal Header Hero Banner */}
        <div className="relative overflow-hidden rounded-sm border border-primary/40 bg-surface p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-xs bg-primary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/30">
                <Flame className="h-3.5 w-3.5 fill-primary text-primary" />
                <span>LIMITED-TIME PROMOTIONS</span>
              </div>
              <h1 className="display-title mt-3 text-3xl sm:text-5xl md:text-6xl text-foreground leading-none">
                OFFERS & CLEARANCE DEALS
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base max-w-2xl">
                Save <span className="font-bold text-primary">up to {maxDiscount}% OFF</span> on
                top-tier cricket bats, badminton gear, football accessories, and sports footwear.
                Order directly on WhatsApp with zero online advance payment.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Active Deals in Store
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {allDeals.length} <span className="text-primary text-xl">Items on Sale</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Sorting Controls Bar */}
        <div className="space-y-4 mb-8">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            {dealTiers.map((tier) => {
              const isActive = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier.id)}
                  className={`rounded-xs px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border/80 bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span>{tier.label}</span>
                  {tier.badge && (
                    <span className="rounded-2xs bg-accent text-accent-foreground px-1 py-0.2 text-[8px] font-black">
                      {tier.badge}
                    </span>
                  )}
                  {tier.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-2xs ${
                        isActive
                          ? "bg-background/20 text-white"
                          : "bg-surface-strong text-muted-foreground"
                      }`}
                    >
                      {tier.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Results Count & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-b border-border/60 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Showing <span className="text-foreground font-bold">{filteredDeals.length}</span> deals
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="deal-sort" className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Sort By:
              </label>
              <select
                id="deal-sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                className="rounded-xs border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="highest-discount">Highest Discount %</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deals Product Grid */}
        {productsQuery.isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredDeals.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredDeals.map((product) => (
              <ProductCard key={product.id} product={product} showWhatsAppAction={true} />
            ))}
          </div>
        ) : (
          <div className="surface-panel rounded-sm p-12 text-center border border-dashed border-border/80">
            <Tag className="mx-auto h-12 w-12 text-muted-foreground opacity-40 mb-3" />
            <h3 className="text-lg font-bold text-foreground">No Deals in this Category</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              There are currently no active offers matching the selected filter. Explore all deals
              or browse our full catalog.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => setSelectedTier("all")} variant="outline" size="sm">
                View All Deals
              </Button>
              <Link to="/products">
                <Button size="sm">Explore All Products</Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
