import { Link } from "react-router-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectPriorityBadge } from "@/components/projects/ProjectPriorityBadge";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { cn, formatDate, getAvatarStyle, getInitials, isOverdue } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onDeleteRequest: (project: Project) => void;
}

export function ProjectCard({ project, onDeleteRequest }: ProjectCardProps) {
  const overdue = isOverdue(project.due_date, project.status);

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow duration-150 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/projects/${project.id}`} className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              getAvatarStyle(project.client_name)
            )}
          >
            {getInitials(project.client_name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {project.project_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{project.client_name}</p>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${project.project_name}`}
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link to={`/projects/${project.id}`} />}>
              <Eye className="size-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link to={`/projects/${project.id}/edit`} />}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDeleteRequest(project)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ProjectStatusBadge status={project.status} />
        <ProjectPriorityBadge priority={project.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>Start {formatDate(project.start_date)}</span>
        <span className={cn(overdue && "font-medium text-red-600 dark:text-red-400")}>
          Due {formatDate(project.due_date)}
        </span>
      </div>
    </div>
  );
}
