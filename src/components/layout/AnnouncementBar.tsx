import { config } from "@/config/config";

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {config.announcements.map((text, i) => (
          <span key={text} className={i === 0 ? "" : "hidden md:inline"}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
