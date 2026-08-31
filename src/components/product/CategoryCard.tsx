import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/models/Category";

const SPORT_SNIPPETS: Record<string, string> = {
  cricket: "Bats • Gloves • Helmets • Balls",
  football: "Balls • Boots • Shin Guards • Training",
  badminton: "Rackets • Shuttles • Grips • Shoes",
  tennis: "Rackets • Balls • Court Accessories",
  basketball: "Balls • Hoops • Court Gear",
  running: "Shoes • Belts • Hydration Gear",
  "fitness-gym": "Dumbbells • Mats • Resistance Bands",
  "sports-shoes": "Court Shoes • Spikes • Trainers",
  "sports-apparel": "Jerseys • Shorts • Track Pants",
  "sports-accessories": "Bags • Bottles • Grips • Extras",
  "protective-gear": "Guards • Helmets • Safety Gear",
};

export function CategoryCard({ category }: { category: Category }) {
  const snippet =
    SPORT_SNIPPETS[category.slug] ?? category.description ?? "Quality gear & equipment";

  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-sm border border-border/80 bg-surface transition-all duration-300 hover:border-primary hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Background Image with athletic contrast overlay */}
      {category.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-500 ease-out group-hover:scale-108 group-hover:opacity-75"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-strong" />
      )}

      {/* Sport Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-300 group-hover:via-background/40" />

      {/* Content Container */}
      <div className="relative z-10 p-4 sm:p-5">
        <span className="eyebrow block text-[10px] font-bold tracking-[0.2em] text-primary transition-transform duration-300 group-hover:translate-x-0.5">
          SPORT
        </span>
        <h3 className="display-title mt-1 text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{snippet}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary opacity-90 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          <span>Explore</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
