import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Planning:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/20",
  "In Progress":
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "On Hold":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  Completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

const DOT_STYLES: Record<ProjectStatus, string> = {
  Planning: "bg-slate-500",
  "In Progress": "bg-blue-500",
  "On Hold": "bg-amber-500",
  Completed: "bg-emerald-500",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", STATUS_STYLES[status])}>
      <span className={cn("size-1.5 shrink-0 rounded-full", DOT_STYLES[status])} />
      {status}
    </Badge>
  );
}
