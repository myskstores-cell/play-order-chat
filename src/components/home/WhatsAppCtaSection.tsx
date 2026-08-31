import { MessageCircle, HelpCircle, PhoneCall } from "lucide-react";
import { Container } from "@/components/common/Section";
import { config } from "@/config/config";
import { whatsappService } from "@/services/whatsappService";

export function WhatsAppCtaSection() {
  const waCtaUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name} 👋, I'm looking for recommendations for my sport and budget. Can you help me find the right gear?`,
  );

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden bg-surface">
      {/* Background glow and subtle sports graphic */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-primary/10 blur-3xl" />

      <Container>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-xs border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>NEED EXPERT ADVICE?</span>
          </div>

          <h2 className="display-title text-4xl sm:text-5xl md:text-6xl text-foreground leading-[0.95]">
            NOT SURE WHAT TO BUY?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base sm:leading-relaxed">
            Tell us your sport, budget, and requirement. Our store team will help you find the exact
            right gear before you order.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waCtaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-13 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xs bg-whatsapp px-8 text-sm font-bold uppercase tracking-wider text-whatsapp-foreground shadow-xl transition-all hover:scale-102 hover:brightness-110 active:scale-[0.99]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>CHAT ON WHATSAPP</span>
            </a>

            <a
              href={`tel:${config.store.phone.replace(/\s/g, "")}`}
              className="inline-flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-xs border border-border bg-surface-strong px-6 text-sm font-semibold uppercase tracking-wider text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-primary" />
              <span>CALL {config.store.phone}</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>✓ Fast response during store hours</span>
            <span>•</span>
            <span>✓ Genuine sizing assistance</span>
            <span>•</span>
            <span>✓ No pushy sales</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
