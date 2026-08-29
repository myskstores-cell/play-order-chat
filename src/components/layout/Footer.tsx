import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { config } from "@/config/config";
import { whatsappService } from "@/services/whatsappService";

const shopLinks = [
  { to: "/products", label: "All Products" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const helpLinks = [
  { to: "/faq", label: "FAQ" },
  { to: "/shipping", label: "Shipping" },
  { to: "/returns", label: "Returns" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
] as const;

export function Footer() {
  const waUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name}, I have a question about your products.`,
  );

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <span className="display-title block text-xl">
            SK <span className="text-primary">SPORT</span> STORE
          </span>
          <p className="mt-3 text-sm text-muted-foreground">{config.store.description}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-2 rounded-sm bg-whatsapp px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-whatsapp-foreground"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>

        <nav aria-label="Shop">
          <h2 className="display-title mb-4 text-sm tracking-widest">Shop</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {shopLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2 className="display-title mb-4 text-sm tracking-widest">Help</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {helpLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="display-title mb-4 text-sm tracking-widest">Visit / Contact</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{config.store.address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`tel:${config.store.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {config.store.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${config.store.email}`} className="hover:text-primary">
                {config.store.email}
              </a>
            </li>
            <li className="text-xs">{config.store.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {config.store.name}. All rights reserved.
          </p>
          <p>Orders are placed and confirmed over WhatsApp — no online payment.</p>
        </div>
      </div>
    </footer>
  );
}
