import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectPriority } from "@/types/project";

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  Low: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/20",
  Medium:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

export function ProjectPriorityBadge({ priority }: { priority: ProjectPriority }) {
  return (
    <Badge variant="outline" className={cn("font-medium", PRIORITY_STYLES[priority])}>
      {priority}
    </Badge>
  );
}
