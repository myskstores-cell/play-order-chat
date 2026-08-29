import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  initialValue = "",
  onSubmitted,
  autoFocus,
}: {
  className?: string;
  initialValue?: string;
  onSubmitted?: () => void;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({ to: "/products", search: { q: value.trim() || undefined } });
    onSubmitted?.();
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="site-search"
        type="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search bats, shoes, rackets…"
        className="h-10 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </form>
  );
}
