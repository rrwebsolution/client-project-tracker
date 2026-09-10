import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Activity, Building2, CalendarCheck, CalendarDays, Flag, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/layout/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectPriorityBadge } from "@/components/projects/ProjectPriorityBadge";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import { getErrorMessage } from "@/services/api";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function fetchProject() {
    if (!id) return;
    setErrorMessage(null);
    setProject(null);
    projectService
      .getById(Number(id))
      .then(setProject)
      .catch((error) =>
        setErrorMessage(getErrorMessage(error, "We couldn't load this project."))
      );
  }

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <PageHeader breadcrumbs={[{ label: "Projects", to: "/projects" }]} title="Project" />
        <ErrorState
          title="Unable to load project"
          message={errorMessage}
          onRetry={fetchProject}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const overdue = isOverdue(project.due_date, project.status);
  const timelinePercent = getTimelinePercent(project);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <PageHeader
            breadcrumbs={[
              { label: "Projects", to: "/projects" },
              { label: project.project_name },
            ]}
            title={project.project_name}
            subtitle={project.client_name}
          />
          <div className="mt-3 flex items-center gap-1.5">
            <ProjectStatusBadge status={project.status} />
            <ProjectPriorityBadge priority={project.priority} />
          </div>
        </div>

        <Button render={<Link to={`/projects/${project.id}/edit`} />} nativeButton={false}>
          <Pencil className="size-4" />
          Edit Project
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-foreground">Project Overview</h2>
        <dl className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem icon={Building2} label="Client" value={project.client_name} />
          <DetailItem
            icon={Activity}
            label="Status"
            value={<ProjectStatusBadge status={project.status} />}
          />
          <DetailItem
            icon={Flag}
            label="Priority"
            value={<ProjectPriorityBadge priority={project.priority} />}
          />
          <DetailItem
            icon={CalendarDays}
            label="Start Date"
            value={formatDate(project.start_date)}
          />
          <DetailItem
            icon={CalendarCheck}
            label="Due Date"
            value={
              <span className={cn(overdue && "font-medium text-red-600 dark:text-red-400")}>
                {formatDate(project.due_date)}
                {overdue && " (overdue)"}
              </span>
            }
          />
        </dl>

        <div className="mt-7 border-t border-border pt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Start</span>
            <span className="font-medium text-foreground">Due</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                overdue ? "bg-red-500" : project.status === "Completed" ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${timelinePercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(project.start_date)}</span>
            <span>{formatDate(project.due_date)}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-foreground">Description</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
}

function getTimelinePercent(project: Project): number {
  const start = new Date(`${project.start_date}T00:00:00`).getTime();
  const due = new Date(`${project.due_date}T00:00:00`).getTime();

  if (project.status === "Completed") return 100;
  if (due <= start) return 100;

  const today = Date.now();
  const percent = ((today - start) / (due - start)) * 100;

  return Math.min(100, Math.max(0, percent));
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-3.5" />
      </span>
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
