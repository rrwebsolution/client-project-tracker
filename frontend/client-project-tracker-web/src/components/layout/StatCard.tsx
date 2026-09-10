import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_STYLES = {
  default: "bg-muted text-muted-foreground",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
} as const;

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  description?: string;
  tone?: keyof typeof TONE_STYLES;
  compact?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "default",
  compact = false,
}: StatCardProps) {
  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 transition-shadow duration-150 hover:shadow-sm">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-lg font-semibold text-foreground">{value}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow duration-150 hover:shadow-sm">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            TONE_STYLES[tone]
          )}
        >
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
