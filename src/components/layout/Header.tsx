import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { config } from "@/config/config";
import { useCart } from "@/hooks/useCart";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { SearchBar } from "@/components/navigation/SearchBar";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0" aria-label={`${config.store.name} home`}>
          <span className="display-title block text-xl leading-none sm:text-2xl">
            SK <span className="text-primary">SPORT</span> STORE
          </span>
        </Link>

        <div className="ml-auto hidden lg:block">
          <DesktopNav />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-6">
          <SearchBar className="hidden w-64 md:block xl:w-72" />
          <Link
            to="/cart"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative rounded-sm p-2 text-foreground hover:text-primary"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="rounded-sm p-2 text-foreground hover:text-primary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
