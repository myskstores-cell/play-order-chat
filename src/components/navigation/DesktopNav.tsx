import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ArrowRight } from "lucide-react";

export const SPORTS_ITEMS = [
  { label: "Cricket", slug: "cricket", desc: "Bats, balls, pads, gear" },
  { label: "Football", slug: "football", desc: "Balls, boots, guards" },
  { label: "Badminton", slug: "badminton", desc: "Rackets, shuttles, grips" },
  { label: "Tennis", slug: "tennis", desc: "Rackets, balls, accessories" },
  { label: "Basketball", slug: "basketball", desc: "Balls, hoops, court gear" },
  { label: "Running", slug: "running", desc: "Shoes, belts, hydration" },
  { label: "Fitness", slug: "fitness-gym", desc: "Dumbbells, mats, bands" },
  { label: "Sports Shoes", slug: "sports-shoes", desc: "Court, spikes, trainers" },
] as const;

export function DesktopNav() {
  const [sportsOpen, setSportsOpen] = useState(false);

  return (
    <nav aria-label="Main" className="hidden items-center gap-6 xl:gap-8 lg:flex">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: "text-primary" }}
        className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary"
      >
        Home
      </Link>

      <Link
        to="/products"
        activeProps={{ className: "text-primary" }}
        className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary"
      >
        Shop
      </Link>

      {/* SPORTS DROPDOWN */}
      <div
        className="relative"
        onMouseEnter={() => setSportsOpen(true)}
        onMouseLeave={() => setSportsOpen(false)}
      >
        <button
          type="button"
          aria-expanded={sportsOpen}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary py-2"
        >
          <span>Sports</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              sportsOpen ? "rotate-180 text-primary" : "text-muted-foreground"
            }`}
          />
        </button>

        {sportsOpen && (
          <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 w-[480px] z-50 animate-in fade-in-50 duration-150">
            <div className="surface-panel rounded-sm border border-border bg-surface p-4 shadow-elevated">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2 px-1">
                <span className="eyebrow text-[10px] font-bold text-primary">SHOP BY SPORT</span>
                <Link
                  to="/categories"
                  onClick={() => setSportsOpen(false)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary"
                >
                  <span>All Categories</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-1">
                {SPORTS_ITEMS.map((sport) => (
                  <Link
                    key={sport.slug}
                    to="/category/$slug"
                    params={{ slug: sport.slug }}
                    onClick={() => setSportsOpen(false)}
                    className="group flex flex-col rounded-xs p-2.5 transition-colors hover:bg-surface-strong"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary">
                      {sport.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                      {sport.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Link
        to="/offers"
        activeProps={{ className: "text-primary" }}
        className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary flex items-center gap-1"
      >
        <span>Offers</span>
        <span className="rounded-2xs bg-primary/20 text-primary px-1.5 py-0.2 text-[9px] font-black tracking-normal">
          HOT
        </span>
      </Link>

      <Link
        to="/about"
        activeProps={{ className: "text-primary" }}
        className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary"
      >
        About
      </Link>

      <Link
        to="/contact"
        activeProps={{ className: "text-primary" }}
        className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary"
      >
        Contact
      </Link>
    </nav>
  );
}
