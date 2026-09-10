import { useState, type FormEvent } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage, isValidationError } from "@/services/api";
import { projectService } from "@/services/projectService";
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type Project,
  type ProjectPayload,
  type ProjectPriority,
  type ProjectStatus,
} from "@/types/project";

const STATUS_OPTIONS: ComboboxOption[] = PROJECT_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

const PRIORITY_OPTIONS: ComboboxOption[] = PROJECT_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority,
}));

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: Project;
  onCancel: () => void;
  onSuccess: (project: Project) => void;
}

interface FormState {
  client_name: string;
  project_name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
}

function toFormState(project?: Project): FormState {
  return {
    client_name: project?.client_name ?? "",
    project_name: project?.project_name ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "Planning",
    priority: project?.priority ?? "Medium",
    start_date: project?.start_date ?? "",
    due_date: project?.due_date ?? "",
  };
}

export function ProjectForm({ mode, project, onCancel, onSuccess }: ProjectFormProps) {
  const toast = useToast();
  const [form, setForm] = useState<FormState>(() => toFormState(project));
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function fieldError(key: keyof FormState): string | undefined {
    return errors[key]?.[0];
  }

  function validate(): Record<string, string[]> {
    const nextErrors: Record<string, string[]> = {};

    if (!form.client_name.trim()) {
      nextErrors.client_name = ["The client name field is required."];
    }
    if (!form.project_name.trim()) {
      nextErrors.project_name = ["The project name field is required."];
    }
    if (!form.start_date) {
      nextErrors.start_date = ["The start date field is required."];
    }
    if (!form.due_date) {
      nextErrors.due_date = ["The due date field is required."];
    }
    if (form.start_date && form.due_date && form.due_date < form.start_date) {
      nextErrors.due_date = ["The due date must not be earlier than the start date."];
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (submitting) return;

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const payload: ProjectPayload = {
      client_name: form.client_name.trim(),
      project_name: form.project_name.trim(),
      description: form.description.trim() ? form.description.trim() : null,
      status: form.status,
      priority: form.priority,
      start_date: form.start_date,
      due_date: form.due_date,
    };

    setSubmitting(true);
    setErrors({});

    try {
      const result =
        mode === "create"
          ? await projectService.create(payload)
          : await projectService.update(project!.id, payload);

      toast.success(
        mode === "create" ? "Project created successfully." : "Project updated successfully.",
        {
          description:
            mode === "create"
              ? `${result.project_name} has been added.`
              : `${result.project_name} has been updated.`,
        }
      );

      onSuccess(result);
    } catch (error) {
      if (isValidationError(error)) {
        setErrors(error.response.data.errors);
        toast.error("Please review the highlighted fields.");
      } else {
        toast.error(mode === "create" ? "Unable to create project." : "Unable to update project.", {
          description: getErrorMessage(error, "Please try again."),
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Project Information</h2>
          <p className="text-xs text-muted-foreground">Who this project is for and what it covers.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="client_name">
              Client Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="client_name"
              value={form.client_name}
              onChange={(e) => setField("client_name", e.target.value)}
              aria-invalid={Boolean(fieldError("client_name"))}
              maxLength={255}
              placeholder="e.g. Acme Corporation"
            />
            {fieldError("client_name") && (
              <p className="text-xs text-destructive">{fieldError("client_name")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project_name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="project_name"
              value={form.project_name}
              onChange={(e) => setField("project_name", e.target.value)}
              aria-invalid={Boolean(fieldError("project_name"))}
              maxLength={255}
              placeholder="e.g. Corporate Website Redesign"
            />
            {fieldError("project_name") && (
              <p className="text-xs text-destructive">{fieldError("project_name")}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              aria-invalid={Boolean(fieldError("description"))}
              placeholder="Briefly describe the scope of this project"
              rows={4}
            />
            {fieldError("description") && (
              <p className="text-xs text-destructive">{fieldError("description")}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Project Details</h2>
          <p className="text-xs text-muted-foreground">Current progress and how urgent it is.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Combobox
              id="status"
              value={form.status}
              onValueChange={(value) => setField("status", value as ProjectStatus)}
              options={STATUS_OPTIONS}
              searchPlaceholder="Search status..."
              aria-label="Status"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="priority">
              Priority <span className="text-destructive">*</span>
            </Label>
            <Combobox
              id="priority"
              value={form.priority}
              onValueChange={(value) => setField("priority", value as ProjectPriority)}
              options={PRIORITY_OPTIONS}
              searchPlaceholder="Search priority..."
              aria-label="Priority"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Timeline</h2>
          <p className="text-xs text-muted-foreground">When work starts and when it's due.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="start_date">
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="start_date"
              type="date"
              value={form.start_date}
              onChange={(e) => setField("start_date", e.target.value)}
              aria-invalid={Boolean(fieldError("start_date"))}
            />
            {fieldError("start_date") && (
              <p className="text-xs text-destructive">{fieldError("start_date")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="due_date">
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="due_date"
              type="date"
              value={form.due_date}
              onChange={(e) => setField("due_date", e.target.value)}
              aria-invalid={Boolean(fieldError("due_date"))}
            />
            {fieldError("due_date") && (
              <p className="text-xs text-destructive">{fieldError("due_date")}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-2 border-t border-border pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : mode === "create" ? (
            <Plus className="size-3.5" />
          ) : (
            <Check className="size-3.5" />
          )}
          {submitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Project"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
