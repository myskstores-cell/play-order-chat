import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { NAV_LINKS } from "./DesktopNav";
import { SearchBar } from "./SearchBar";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-6 border-l border-border bg-surface p-6"
      >
        <div className="flex items-center justify-between">
          <span className="display-title text-lg">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-sm p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SearchBar onSubmitted={onClose} />
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="border-b border-border py-4 text-sm font-semibold uppercase tracking-[0.16em]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/faq"
            onClick={onClose}
            className="border-b border-border py-4 text-sm font-semibold uppercase tracking-[0.16em]"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </div>
  );
}
