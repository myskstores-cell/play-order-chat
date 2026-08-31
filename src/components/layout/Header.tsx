import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, ShoppingBag, MessageCircle, LogOut, ShieldCheck, ExternalLink } from "lucide-react";
import { config } from "@/config/config";
import { useCart } from "@/hooks/useCart";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { SearchBar } from "@/components/navigation/SearchBar";
import { whatsappService } from "@/services/whatsappService";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  async function handleSignOut() {
    const confirmed = window.confirm("Are you sure you want to sign out from SK Sport Store?");
    if (!confirmed) return;

    setSigningOut(true);
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate({ to: "/auth", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  }

  const waHeaderUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name} 👋, I'd like to enquire about products available in store.`,
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          className="shrink-0 group flex items-center gap-2"
          aria-label={`${config.store.name} home`}
        >
          <span className="display-title block text-xl tracking-tight leading-none sm:text-2xl">
            SK <span className="text-primary group-hover:brightness-110">SPORT</span> STORE
          </span>
          {isAdminRoute && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-2xs bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3" /> Staff Admin
            </span>
          )}
        </Link>

        {/* DESKTOP NAVIGATION (Storefront only) */}
        {!isAdminRoute && !isAuthRoute && (
          <div className="ml-4 hidden lg:block xl:ml-8">
            <DesktopNav />
          </div>
        )}

        {isAdminRoute && (
          <div className="ml-4 hidden sm:flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Storefront
            </Link>
          </div>
        )}

        {/* RIGHT ACTIONS */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* SEARCH BAR (Storefront only) */}
          {!isAdminRoute && !isAuthRoute && (
            <SearchBar className="hidden w-48 md:block lg:w-56 xl:w-64" />
          )}

          {/* DIRECT WHATSAPP ACTION (Storefront only) */}
          {!isAdminRoute && !isAuthRoute && (
            <a
              href={waHeaderUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xs bg-whatsapp/15 px-3 py-2 text-xs font-bold uppercase tracking-wider text-whatsapp border border-whatsapp/30 transition-all hover:bg-whatsapp hover:text-whatsapp-foreground"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
          )}

          {/* ENQUIRY / CART (Storefront only) */}
          {!isAdminRoute && !isAuthRoute && (
            <Link
              to="/cart"
              aria-label={`Enquiry list / Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className="relative flex items-center gap-1.5 rounded-xs border border-border/80 bg-surface px-2.5 py-2 text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:px-3"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden text-xs font-bold uppercase tracking-wider md:inline">
                Enquiry
              </span>
              {itemCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {/* SIGN OUT BUTTON (Shown only on the Admin page) */}
          {isAdminRoute && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 rounded-xs border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{signingOut ? "Signing out…" : "Sign Out"}</span>
            </button>
          )}

          {/* MOBILE MENU TOGGLE (Storefront only) */}
          {!isAdminRoute && !isAuthRoute && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-xs border border-border/80 bg-surface p-2 text-foreground hover:border-primary/50 hover:text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH BAR (Storefront only) */}
      {!isAdminRoute && !isAuthRoute && (
        <div className="border-t border-border/60 bg-surface/50 px-4 py-2 md:hidden">
          <SearchBar />
        </div>
      )}

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
