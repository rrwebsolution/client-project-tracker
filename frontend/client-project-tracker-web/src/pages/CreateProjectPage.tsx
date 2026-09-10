import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";

export function CreateProjectPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Projects", to: "/projects" }, { label: "New Project" }]}
        title="Create Project"
        subtitle="Add a new client project and define its details, priority, and timeline."
      />

      <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <ProjectForm
          mode="create"
          onCancel={() => navigate("/projects")}
          onSuccess={() => navigate("/projects")}
        />
      </div>
    </div>
  );
}
