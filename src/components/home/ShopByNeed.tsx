import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";

const NEEDS = [
  {
    tag: "MATCH & NETS",
    title: "CRICKET ESSENTIALS",
    items: [
      "English & Kashmir Willow Bats",
      "Pro Batting Gloves & Pads",
      "Match Leather Balls",
      "Protective Helmets",
    ],
    slug: "cricket",
    image: "/images/cat-cricket.jpg",
  },
  {
    tag: "PITCH & DRILLS",
    title: "FOOTBALL TRAINING",
    items: [
      "Thermo-Bonded Match Balls",
      "Firm Ground Moulded Boots",
      "Impact Shell Shin Guards",
      "Training Apparel",
    ],
    slug: "football",
    image: "/images/cat-football.jpg",
  },
  {
    tag: "ROAD & TRACK",
    title: "RUNNING GEAR",
    items: [
      "Cushioned Daily Running Shoes",
      "Breathable Waist Belts",
      "Hydration Bottles",
      "Quick-Dry Apparel",
    ],
    slug: "running",
    image: "/images/cat-running.jpg",
  },
  {
    tag: "STRENGTH & MOBILITY",
    title: "HOME FITNESS",
    items: [
      "Cast Iron / PVC Dumbbells",
      "Anti-Slip High Density Mats",
      "Multi-Level Resistance Bands",
      "Speed Skipping Ropes",
    ],
    slug: "fitness-gym",
    image: "/images/cat-fitness.jpg",
  },
];

export function ShopByNeed() {
  return (
    <section className="py-12 sm:py-16 border-b border-border/60">
      <Container>
        <SectionHeader
          eyebrow="TAILORED COLLECTIONS"
          title="FIND WHAT YOU NEED"
          description="Curated equipment sets ready for matchday, training, or fitness."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {NEEDS.map((need) => (
            <Link
              key={need.title}
              to="/category/$slug"
              params={{ slug: need.slug }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-border/80 bg-surface p-5 transition-all duration-300 hover:border-primary hover:shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
            >
              {/* Background Ambient Image */}
              <img
                src={need.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-15 transition-transform duration-500 group-hover:scale-108 group-hover:opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/95 to-surface" />

              <div className="relative z-10">
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-primary">
                  <Flame className="h-3 w-3" />
                  <span>{need.tag}</span>
                </div>

                <h3 className="display-title mt-2 text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                  {need.title}
                </h3>

                <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  {need.items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold uppercase tracking-wider text-primary">
                <span>Shop Collection</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
