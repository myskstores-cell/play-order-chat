import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react";
import { config } from "@/config/config";
import { whatsappService } from "@/services/whatsappService";

const sportLinks = [
  { label: "All Products", to: "/products" as const },
  { label: "Cricket", slug: "cricket" },
  { label: "Football", slug: "football" },
  { label: "Badminton", slug: "badminton" },
  { label: "Tennis", slug: "tennis" },
  { label: "Running", slug: "running" },
  { label: "Fitness", slug: "fitness-gym" },
] as const;

const helpLinks = [
  { to: "/faq", label: "FAQ & How to Order" },
  { to: "/shipping", label: "Delivery Info" },
  { to: "/returns", label: "Returns & Exchange" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
] as const;

export function Footer() {
  const waUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name} 👋, I have an enquiry about sports gear and pricing.`,
  );

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand & WhatsApp */}
        <div>
          <span className="display-title block text-2xl font-bold">
            SK <span className="text-primary">SPORT</span> STORE
          </span>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {config.store.description}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-2 rounded-xs bg-whatsapp px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-whatsapp-foreground transition-all hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Shop by Sport */}
        <nav aria-label="Shop">
          <h2 className="eyebrow mb-4 text-xs font-bold text-foreground">SHOP BY SPORT</h2>
          <ul className="space-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
            {sportLinks.map((l) => (
              <li key={l.label}>
                {"slug" in l ? (
                  <Link
                    to="/category/$slug"
                    params={{ slug: l.slug }}
                    className="transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <Link to={l.to} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Help & Support */}
        <nav aria-label="Help">
          <h2 className="eyebrow mb-4 text-xs font-bold text-foreground">CUSTOMER HELP</h2>
          <ul className="space-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
            {helpLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Visit & Contact */}
        <div>
          <h2 className="eyebrow mb-4 text-xs font-bold text-foreground">
            STORE LOCATION & CONTACT
          </h2>
          <ul className="space-y-3 text-xs text-muted-foreground sm:text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{config.store.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={`tel:${config.store.phone.replace(/\s/g, "")}`}
                className="font-medium text-foreground hover:text-primary"
              >
                {config.store.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${config.store.email}`} className="hover:text-primary">
                {config.store.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-[11px] text-muted-foreground pt-1">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              <span>{config.store.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/80 bg-background/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {config.store.name}. All rights reserved.
          </p>
          <p className="text-foreground/80 font-medium">
            Orders are placed and confirmed over WhatsApp — no online payment.
          </p>
        </div>
      </div>
    </footer>
  );
}
