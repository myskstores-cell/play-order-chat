import { Shield, MessageCircle, BadgePercent, MapPin } from "lucide-react";
import { Container, SectionHeader } from "@/components/common/Section";

const REASONS = [
  {
    icon: Shield,
    title: "SPORTS-FOCUSED SELECTION",
    desc: "Gear for training, competition and everyday play curated specifically for active athletes.",
  },
  {
    icon: MessageCircle,
    title: "EASY WHATSAPP ORDERING",
    desc: "Talk directly with the store before ordering to confirm specifications, sizing and availability.",
  },
  {
    icon: BadgePercent,
    title: "COMPETITIVE PRICING",
    desc: "Find genuine sports equipment and footwear at practical, competitive prices.",
  },
  {
    icon: MapPin,
    title: "LOCAL STORE SUPPORT",
    desc: "Get direct assistance from our physical store team whenever you need help with your sports gear.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 border-b border-border/60">
      <Container>
        <SectionHeader
          eyebrow="BUILT FOR ATHLETES"
          title="WHY SK SPORT STORE?"
          description="Reliable sports equipment with direct, personalized assistance."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="group rounded-sm border border-border/80 bg-surface p-6 transition-colors hover:border-primary/50 hover:bg-surface-strong"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xs bg-surface-strong border border-border/60 text-primary group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="display-title text-xl text-foreground group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
