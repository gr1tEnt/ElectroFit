import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  variant?: "default" | "warning";
  icon?: ReactNode;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  variant = "default",
  icon,
  children,
}: EmptyStateProps) {
  const isWarning = variant === "warning";

  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-2xl border p-10 text-center ${
        isWarning
          ? "border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50/80"
          : "border-dashed border-border bg-white"
      }`}
      role="status"
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm ${
          isWarning ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
        }`}
        aria-hidden
      >
        {icon ?? (isWarning ? "⚠" : "∅")}
      </span>
      <h3
        className={`mt-5 text-xl font-bold ${isWarning ? "text-amber-950" : "text-ink"}`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 max-w-lg text-sm leading-relaxed ${
          isWarning ? "text-amber-900/90" : "text-muted"
        }`}
      >
        {description}
      </p>
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
