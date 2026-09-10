import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CircleCheck, Clock3, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { ErrorState } from "@/components/layout/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { ProjectPriorityBadge } from "@/components/projects/ProjectPriorityBadge";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { cn, formatDate, getAvatarStyle, getInitials, isOverdue } from "@/lib/utils";
import { getErrorMessage } from "@/services/api";
import { projectService } from "@/services/projectService";
import { PROJECT_STATUSES, type Project } from "@/types/project";

const STATUS_BAR_COLOR: Record<string, string> = {
  Planning: "bg-slate-400",
  "In Progress": "bg-blue-500",
  "On Hold": "bg-amber-500",
  Completed: "bg-emerald-500",
};

export function DashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function fetchProjects() {
    setErrorMessage(null);
    setProjects(null);
    projectService
      .getAll({ sort: "newest" })
      .then(setProjects)
      .catch((error) =>
        setErrorMessage(
          getErrorMessage(error, "We couldn't retrieve your projects. Please try again.")
        )
      );
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const stats = projects
    ? {
        total: projects.length,
        inProgress: projects.filter((p) => p.status === "In Progress").length,
        completed: projects.filter((p) => p.status === "Completed").length,
        highPriority: projects.filter((p) => p.priority === "High").length,
      }
    : null;

  const statusCounts = projects
    ? PROJECT_STATUSES.map((status) => ({
        status,
        count: projects.filter((p) => p.status === status).length,
      }))
    : null;

  const recentProjects = projects?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Monitor your client projects and stay ahead of deadlines."
      />

      {errorMessage && (
        <ErrorState
          title="Unable to load projects"
          message={errorMessage}
          onRetry={fetchProjects}
        />
      )}

      {!errorMessage && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats ? (
              <>
                <StatCard
                  icon={FolderKanban}
                  label="Total Projects"
                  value={stats.total}
                  description="All client projects"
                />
                <StatCard
                  icon={Clock3}
                  label="In Progress"
                  value={stats.inProgress}
                  description="Currently active"
                  tone="info"
                />
                <StatCard
                  icon={CircleCheck}
                  label="Completed"
                  value={stats.completed}
                  description="Successfully delivered"
                  tone="success"
                />
                <StatCard
                  icon={AlertTriangle}
                  label="High Priority"
                  value={stats.highPriority}
                  description="Needs close attention"
                  tone="danger"
                />
              </>
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
              <h2 className="text-sm font-semibold text-foreground">Project Status</h2>
              {statusCounts ? (
                <div className="mt-4 space-y-3">
                  {statusCounts.map(({ status, count }) => {
                    const percent = stats!.total > 0 ? (count / stats!.total) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{status}</span>
                          <span className="font-medium text-foreground">{count}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              STATUS_BAR_COLOR[status]
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full rounded" />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card lg:col-span-3">
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
                <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to="/projects" />}
                  nativeButton={false}
                >
                  View all projects
                  <span aria-hidden="true">→</span>
                </Button>
              </div>

              {projects === null ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-11 w-full rounded-lg" />
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    icon={FolderKanban}
                    title="No projects yet"
                    description="Create your first client project to start tracking progress and deadlines."
                    action={
                      <Button
                        size="sm"
                        render={<Link to="/projects/new" />}
                        nativeButton={false}
                      >
                        Create Project
                      </Button>
                    }
                  />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {recentProjects.map((project) => {
                    const overdue = isOverdue(project.due_date, project.status);

                    return (
                      <li key={project.id}>
                        <Link
                          to={`/projects/${project.id}`}
                          className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
                        >
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                              getAvatarStyle(project.client_name)
                            )}
                          >
                            {getInitials(project.client_name)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {project.project_name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {project.client_name}
                            </p>
                          </div>
                          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                            <ProjectStatusBadge status={project.status} />
                            <ProjectPriorityBadge priority={project.priority} />
                          </div>
                          <span
                            className={cn(
                              "hidden shrink-0 text-xs text-muted-foreground sm:block",
                              overdue && "font-medium text-red-600 dark:text-red-400"
                            )}
                          >
                            {formatDate(project.due_date)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
