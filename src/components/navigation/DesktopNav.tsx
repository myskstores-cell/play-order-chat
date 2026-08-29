import { Link } from "@tanstack/react-router";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function DesktopNav() {
  return (
    <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          activeOptions={{ exact: link.to === "/" }}
          activeProps={{ className: "text-primary" }}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
