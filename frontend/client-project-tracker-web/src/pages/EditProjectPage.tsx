import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/layout/ErrorState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getErrorMessage } from "@/services/api";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";

export function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Projects", to: "/projects" }, { label: "Edit Project" }]}
        title="Edit Project"
        subtitle="Update project information, status, priority, or timeline."
      />

      {errorMessage && (
        <ErrorState
          title="Unable to load project"
          message={errorMessage}
          onRetry={fetchProject}
        />
      )}

      {!errorMessage && !project && (
        <div className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!errorMessage && project && (
        <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <ProjectForm
            mode="edit"
            project={project}
            onCancel={() => navigate(`/projects/${project.id}`)}
            onSuccess={(updated) => navigate(`/projects/${updated.id}`)}
          />
        </div>
      )}
    </div>
  );
}
