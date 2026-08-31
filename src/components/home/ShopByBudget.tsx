import { Link } from "@tanstack/react-router";
import { ArrowRight, IndianRupee } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";

const BUDGET_TIERS = [
  {
    range: "UNDER ₹999",
    desc: "Everyday essentials",
    detail: "Shuttles, grips, skipping ropes, balls & accessories",
    search: { maxPrice: 999 },
    accent: "border-border/80",
  },
  {
    range: "₹999 – ₹2,499",
    desc: "Popular picks",
    detail: "Training balls, bats, basic rackets & training shoes",
    search: { minPrice: 999, maxPrice: 2499 },
    accent: "border-border/80",
  },
  {
    range: "₹2,499 – ₹4,999",
    desc: "Performance gear",
    detail: "Carbon rackets, football boots, court footwear & bags",
    search: { minPrice: 2499, maxPrice: 4999 },
    accent: "border-primary/40",
  },
  {
    range: "₹5,000+",
    desc: "Premium equipment",
    detail: "English willow bats, tournament gear & pro setups",
    search: { minPrice: 5000 },
    accent: "border-primary/80",
  },
];

export function ShopByBudget() {
  return (
    <section className="py-12 sm:py-16 border-b border-border/60">
      <Container>
        <SectionHeader
          eyebrow="PRICE FILTER"
          title="SHOP BY BUDGET"
          description="Find the right gear at your target price point."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUDGET_TIERS.map((tier) => (
            <Link
              key={tier.range}
              to="/products"
              search={tier.search}
              className={`group flex flex-col justify-between rounded-sm border ${tier.accent} bg-surface p-5 transition-all duration-300 hover:border-primary hover:bg-surface-strong hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]`}
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-primary">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span>PRICE RANGE</span>
                </div>
                <h3 className="display-title text-2xl sm:text-3xl text-foreground group-hover:text-primary transition-colors">
                  {tier.range}
                </h3>
                <p className="mt-1 text-sm font-semibold text-foreground/90">{tier.desc}</p>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{tier.detail}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold uppercase tracking-wider text-primary">
                <span>View Products</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
