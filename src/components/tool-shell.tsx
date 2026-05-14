import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ToolShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

export function OutputCard({
  title,
  isLoading,
  children,
  empty,
  actions,
}: {
  title: string;
  isLoading?: boolean;
  children?: ReactNode;
  empty?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {actions}
      </div>
      <div className="p-5 min-h-[200px]">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        ) : children ? (
          children
        ) : (
          <p className="text-sm text-muted-foreground">{empty ?? "Output will appear here."}</p>
        )}
      </div>
    </div>
  );
}
