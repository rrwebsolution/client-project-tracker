import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { ErrorState } from "@/components/layout/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import {
  DEFAULT_FILTERS,
  ProjectFilters,
  type ProjectFilterState,
} from "@/components/projects/ProjectFilters";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { getErrorMessage } from "@/services/api";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";

interface ProjectStats {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
}

function computeStats(projects: Project[]): ProjectStats {
  return {
    total: projects.length,
    planning: projects.filter((p) => p.status === "Planning").length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    completed: projects.filter((p) => p.status === "Completed").length,
  };
}

export function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilterState>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  const fetchStats = useCallback(() => {
    projectService
      .getAll()
      .then((all) => setStats(computeStats(all)))
      .catch(() => {
        // Stats are a secondary affordance; a failed fetch here doesn't block the page.
      });
  }, []);

  const fetchProjects = useCallback(() => {
    setErrorMessage(null);
    projectService
      .getAll({
        search: debouncedSearch || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        priority: filters.priority === "all" ? undefined : filters.priority,
        sort: filters.sort,
      })
      .then(setProjects)
      .catch((error) => {
        setProjects(null);
        setErrorMessage(getErrorMessage(error, "We couldn't retrieve your projects. Please try again."));
      });
  }, [debouncedSearch, filters.status, filters.priority, filters.sort]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  function handleDeleted() {
    fetchProjects();
    fetchStats();
  }

  const isFiltered =
    filters.search !== "" || filters.status !== "all" || filters.priority !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Overview", to: "/" }, { label: "Projects" }]}
        title="Client Projects"
        subtitle="Manage client projects, timelines, progress, and priorities."
        actions={
          <Button render={<Link to="/projects/new" />} nativeButton={false}>
            <Plus className="size-4" />
            New Project
          </Button>
        }
      />

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={FolderKanban} label="Total" value={stats.total} compact />
          <StatCard icon={FolderKanban} label="Planning" value={stats.planning} compact />
          <StatCard icon={FolderKanban} label="In Progress" value={stats.inProgress} compact />
          <StatCard icon={FolderKanban} label="Completed" value={stats.completed} compact />
        </div>
      )}

      <ProjectFilters value={filters} onChange={setFilters} />

      {projects === null && errorMessage === null && <ProjectsSkeleton />}

      {errorMessage && (
        <ErrorState
          title="Unable to load projects"
          message={errorMessage}
          onRetry={fetchProjects}
        />
      )}

      {projects !== null && !errorMessage && projects.length === 0 && (
        isFiltered ? (
          <EmptyState
            icon={FolderKanban}
            title="No matching projects"
            description="We couldn't find any projects matching your current filters."
            action={
              <Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first client project to start tracking progress and deadlines."
            action={
              <Button size="sm" render={<Link to="/projects/new" />} nativeButton={false}>
                <Plus className="size-4" />
                Create Project
              </Button>
            }
          />
        )
      )}

      {projects !== null && !errorMessage && projects.length > 0 && (
        <>
          <div className="hidden lg:block">
            <ProjectTable projects={projects} onDeleteRequest={setDeleteTarget} />
          </div>
          <div className="space-y-3 lg:hidden">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDeleteRequest={setDeleteTarget}
              />
            ))}
          </div>
        </>
      )}

      <DeleteProjectDialog
        project={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
