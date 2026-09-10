import { Link, useNavigate } from "react-router-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectPriorityBadge } from "@/components/projects/ProjectPriorityBadge";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { cn, formatDate, getAvatarStyle, getInitials, isOverdue } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectTableProps {
  projects: Project[];
  onDeleteRequest: (project: Project) => void;
}

export function ProjectTable({ projects, onDeleteRequest }: ProjectTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="py-3 pl-4 text-xs font-medium text-muted-foreground">
              Client
            </TableHead>
            <TableHead className="py-3 text-xs font-medium text-muted-foreground">
              Project
            </TableHead>
            <TableHead className="py-3 text-xs font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="py-3 text-xs font-medium text-muted-foreground">
              Priority
            </TableHead>
            <TableHead className="py-3 text-xs font-medium text-muted-foreground">
              Start Date
            </TableHead>
            <TableHead className="py-3 text-xs font-medium text-muted-foreground">
              Due Date
            </TableHead>
            <TableHead className="w-10 py-3 pr-4 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const overdue = isOverdue(project.due_date, project.status);

            return (
              <TableRow
                key={project.id}
                className="cursor-pointer border-border transition-colors duration-150 hover:bg-muted/40"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <TableCell className="py-3 pl-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        getAvatarStyle(project.client_name)
                      )}
                    >
                      {getInitials(project.client_name)}
                    </span>
                    <span className="font-medium text-foreground">
                      {project.client_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-64 whitespace-normal py-3">
                  <p className="font-semibold text-foreground">{project.project_name}</p>
                  {project.description && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <ProjectStatusBadge status={project.status} />
                </TableCell>
                <TableCell className="py-3">
                  <ProjectPriorityBadge priority={project.priority} />
                </TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {formatDate(project.start_date)}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-3",
                    overdue ? "font-medium text-red-600 dark:text-red-400" : "text-foreground"
                  )}
                >
                  {formatDate(project.due_date)}
                </TableCell>
                <TableCell
                  className="py-3 pr-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
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
                      <DropdownMenuItem
                        render={<Link to={`/projects/${project.id}/edit`} />}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDeleteRequest(project)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
