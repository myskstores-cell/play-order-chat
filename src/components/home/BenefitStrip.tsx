import { CheckCircle2, IndianRupee, MessageCircle, RotateCcw } from "lucide-react";
import { Container } from "@/components/common/Section";

const BENEFITS = [
  {
    icon: CheckCircle2,
    title: "QUALITY SPORTS GEAR",
    desc: "Quality equipment for your game",
    accent: "text-primary",
  },
  {
    icon: IndianRupee,
    title: "BEST VALUE",
    desc: "Competitive pricing",
    accent: "text-primary",
  },
  {
    icon: MessageCircle,
    title: "WHATSAPP ORDERING",
    desc: "Talk directly with the store",
    accent: "text-whatsapp",
  },
  {
    icon: RotateCcw,
    title: "EASY SUPPORT",
    desc: "Get help when you need it",
    accent: "text-primary",
  },
];

export function BenefitStrip() {
  return (
    <section className="border-b border-border/80 bg-surface/60 py-6 sm:py-8">
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xs border border-border/60 bg-surface/40 p-3.5 sm:p-4 transition-colors hover:border-primary/40 hover:bg-surface"
              >
                <div
                  className={`mt-0.5 rounded-xs bg-background/80 p-2 ${item.accent} border border-border/40 shrink-0`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
