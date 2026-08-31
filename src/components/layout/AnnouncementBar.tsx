import { useRouterState } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function AnnouncementBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide announcement bar on admin and auth pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const items = [
    "DIRECT WHATSAPP ORDERS",
    "LOCAL DELIVERY AVAILABLE",
    "GENUINE SPORTS GEAR",
    "NO ONLINE PAYMENT REQUIRED",
  ];

  return (
    <div className="border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] sm:gap-6">
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 fill-current" />
          <span>{items[0]}</span>
        </div>
        <span className="hidden opacity-60 md:inline">•</span>
        <span className="hidden md:inline">{items[1]}</span>
        <span className="hidden opacity-60 lg:inline">•</span>
        <span className="hidden lg:inline">{items[2]}</span>
        <span className="hidden opacity-60 sm:inline">•</span>
        <span className="hidden sm:inline">{items[3]}</span>
      </div>
    </div>
  );
}
