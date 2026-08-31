import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/productsApi";
import { categoriesApi } from "@/api/categoriesApi";
import { HeroSection } from "@/components/home/HeroSection";
import { BenefitStrip } from "@/components/home/BenefitStrip";
import { ShopBySport } from "@/components/home/ShopBySport";
import { BestSellers } from "@/components/home/BestSellers";
import { ShopByNeed } from "@/components/home/ShopByNeed";
import { DealsSection } from "@/components/home/DealsSection";
import { ShopByBudget } from "@/components/home/ShopByBudget";
import { NewArrivals } from "@/components/home/NewArrivals";
import { KitBuilder } from "@/components/home/KitBuilder";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { WhatsAppCtaSection } from "@/components/home/WhatsAppCtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SK Sport Store — Sports Gear, Shoes & Equipment | WhatsApp Orders" },
      {
        name: "description",
        content:
          "Shop cricket, football, badminton, tennis, running and fitness equipment at SK Sport Store. Order directly on WhatsApp with expert store support — no online payment.",
      },
      {
        property: "og:title",
        content: "SK Sport Store — Sports Gear, Shoes & Equipment",
      },
      {
        property: "og:description",
        content: "Browse sports equipment, footwear and apparel. Order and confirm on WhatsApp.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const allProductsQuery = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsApi.list(),
  });

  const featuredQuery = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.featured(8),
  });

  const newArrivalsQuery = useQuery({
    queryKey: ["products", "newArrivals"],
    queryFn: () => productsApi.newArrivals(8),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const allProducts = allProductsQuery.data ?? [];
  const featuredProducts = featuredQuery.data ?? [];
  const newArrivals = newArrivalsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  return (
    <div className="flex flex-col">
      {/* 03. HERO SECTION */}
      <HeroSection />

      {/* 04. TRUST / BENEFITS STRIP */}
      <BenefitStrip />

      {/* 05. SHOP BY SPORT */}
      <ShopBySport categories={categories} isLoading={categoriesQuery.isLoading} />

      {/* 06. BEST SELLERS */}
      <BestSellers
        products={featuredProducts.length > 0 ? featuredProducts : allProducts}
        isLoading={featuredQuery.isLoading}
      />

      {/* 07. SHOP BY NEED */}
      <ShopByNeed />

      {/* 08. DEALS OF THE WEEK */}
      <DealsSection products={allProducts} />

      {/* 09. SHOP BY BUDGET */}
      <ShopByBudget />

      {/* 10. NEW ARRIVALS */}
      <NewArrivals
        products={newArrivals.length > 0 ? newArrivals : allProducts}
        isLoading={newArrivalsQuery.isLoading}
      />

      {/* 11. BUILD YOUR KIT */}
      <KitBuilder products={allProducts} />

      {/* 13. WHY SK SPORT STORE */}
      <WhyChooseUs />

      {/* 14. WHATSAPP CTA */}
      <WhatsAppCtaSection />
    </div>
  );
}
