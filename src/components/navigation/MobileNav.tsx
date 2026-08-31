import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, MessageCircle, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { SPORTS_ITEMS } from "./DesktopNav";
import { SearchBar } from "./SearchBar";
import { config } from "@/config/config";
import { whatsappService } from "@/services/whatsappService";
import { useCart } from "@/hooks/useCart";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sportsExpanded, setSportsExpanded] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const waUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name} 👋, I'm browsing your store on mobile and would like some assistance.`,
  );

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-border bg-surface shadow-2xl overflow-y-auto"
      >
        {/* Header inside drawer */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="display-title text-lg font-bold">
            SK <span className="text-primary">SPORT</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-sm p-1.5 text-muted-foreground hover:bg-surface-strong hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/60">
          <SearchBar onSubmitted={onClose} />
        </div>

        {/* Navigation list */}
        <nav aria-label="Mobile" className="flex flex-1 flex-col px-4 py-2">
          <Link
            to="/"
            onClick={onClose}
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary font-bold" }}
            className="border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            activeProps={{ className: "text-primary font-bold" }}
            className="border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            Shop All Products
          </Link>

          {/* Sports Accordion */}
          <div className="border-b border-border/50 py-2">
            <button
              type="button"
              onClick={() => setSportsExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
            >
              <span>Shop By Sport</span>
              {sportsExpanded ? (
                <ChevronUp className="h-4 w-4 text-primary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {sportsExpanded && (
              <div className="mt-1 space-y-1 pl-3 pb-2 border-l border-primary/40 ml-1">
                {SPORTS_ITEMS.map((item) => (
                  <Link
                    key={item.slug}
                    to="/category/$slug"
                    params={{ slug: item.slug }}
                    onClick={onClose}
                    className="block py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/offers"
            onClick={onClose}
            className="flex items-center justify-between border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            <span>Offers & Deals</span>
            <span className="rounded-2xs bg-primary/20 text-primary px-1.5 py-0.5 text-[9px] font-black">
              HOT
            </span>
          </Link>

          <Link
            to="/categories"
            onClick={onClose}
            className="border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            All Categories
          </Link>

          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center justify-between border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Enquiry List / Cart</span>
            </div>
            {itemCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            Contact & Location
          </Link>

          <Link
            to="/faq"
            onClick={onClose}
            className="border-b border-border/50 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            FAQ & Ordering Help
          </Link>
        </nav>

        {/* Bottom Drawer Actions */}
        <div className="mt-auto border-t border-border p-4 bg-surface-strong/50">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-full items-center justify-center gap-2 rounded-xs bg-whatsapp py-3 text-xs font-bold uppercase tracking-wider text-whatsapp-foreground transition-all hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Direct store assistance • No online payment
          </p>
        </div>
      </div>
    </div>
  );
}
