import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Container } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { config } from "@/config/config";
import { whatsappService } from "@/services/whatsappService";

export function HeroSection() {
  const waHeroUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name} 👋, I'm visiting your website and would like to ask about available sports gear and ordering.`,
  );

  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-background pt-8 pb-12 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-20">
      {/* Background subtle athletic ambient glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Small Label */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-xs border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>SK SPORT STORE</span>
            </div>

            {/* Main Headline */}
            <h1 className="display-title text-5xl tracking-tight sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl leading-[0.92]">
              PLAY HARD.
              <br />
              <span className="text-primary">PLAY BETTER.</span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
              Sports equipment, footwear and apparel for every game. Order directly through WhatsApp
              with direct store assistance.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 text-sm font-bold tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>

              <a
                href={waHeroUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-13 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xs bg-whatsapp px-7 text-sm font-bold uppercase tracking-wider text-whatsapp-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>CHAT ON WHATSAPP</span>
              </a>
            </div>

            {/* Quick Trust Highlights below CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>100% Genuine Gear</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-bold">₹</span>
                <span>Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-whatsapp" />
                <span>Instant WhatsApp Help</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Display */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden rounded-sm border border-border bg-surface shadow-2xl">
                <img
                  src="/images/hero.jpg"
                  alt="SK Sport Store Sports Gear"
                  loading="eager"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />

                {/* Athletic Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                {/* Floating Badge on Visual */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xs border border-border/80 bg-surface/90 p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="eyebrow text-[10px] font-bold text-primary">ALL MAJOR SPORTS</p>
                      <p className="display-title mt-0.5 text-base sm:text-lg text-foreground">
                        CRICKET • FOOTBALL • RACKETS • SHOES
                      </p>
                    </div>
                    <Link
                      to="/categories"
                      className="rounded-xs bg-primary/10 p-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="View all categories"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Lime accent decorative corner */}
              <div className="pointer-events-none absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-sm border-2 border-primary/30" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
