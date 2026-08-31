import type { ReactNode } from "react";
import { Loader2, PackageX, TriangleAlert } from "lucide-react";
import { Button } from "./Button";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-panel animate-pulse rounded-sm">
          <div className="aspect-square bg-surface-strong" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 rounded bg-surface-strong" />
            <div className="h-4 w-3/4 rounded bg-surface-strong" />
            <div className="h-4 w-1/2 rounded bg-surface-strong" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="surface-panel flex flex-col items-center gap-3 rounded-sm px-6 py-14 text-center"
    >
      <TriangleAlert className="h-7 w-7 text-destructive" aria-hidden="true" />
      <h2 className="display-title text-2xl">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-panel flex flex-col items-center gap-3 rounded-sm px-6 py-16 text-center">
      <PackageX className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      <h2 className="display-title text-2xl">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
