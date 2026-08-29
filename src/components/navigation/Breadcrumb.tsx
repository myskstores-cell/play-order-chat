import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {item.to ? (
              <Link
                to={item.to as never}
                params={item.params as never}
                search={item.search as never}
                className="hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
