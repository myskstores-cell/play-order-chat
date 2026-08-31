import { useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { config } from "@/config/config";
import { whatsappService } from "@/services/whatsappService";

export function FloatingWhatsApp() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on admin and auth pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const waUrl = whatsappService.generateWhatsAppUrl(
    `Hi ${config.store.name} 👋, I'm browsing your online store and have a question about sports gear and ordering.`,
  );

  return (
    <>
      {/* Desktop Floating WhatsApp Button (Bottom Right) */}
      <aside
        aria-label="WhatsApp Quick Support"
        className="fixed bottom-6 right-6 z-40 hidden md:block"
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex items-center gap-2.5 rounded-full bg-whatsapp px-5 py-3 text-xs font-bold uppercase tracking-wider text-whatsapp-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp-foreground opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-whatsapp-foreground" />
            </span>
          </div>
          <span>Chat on WhatsApp</span>
        </a>
      </aside>

      {/* Mobile Sticky Bottom WhatsApp CTA Bar */}
      <aside
        aria-label="Mobile WhatsApp Ordering"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 p-2.5 backdrop-blur-md md:hidden"
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xs bg-whatsapp px-4 text-xs font-bold uppercase tracking-wider text-whatsapp-foreground shadow-lg transition-transform active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat / Order on WhatsApp</span>
        </a>
      </aside>
    </>
  );
}
