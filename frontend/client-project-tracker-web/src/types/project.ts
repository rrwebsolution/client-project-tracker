export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed";

export type ProjectPriority = "Low" | "Medium" | "High";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
];

export const PROJECT_PRIORITIES: ProjectPriority[] = ["Low", "Medium", "High"];

export interface Project {
  id: number;
  client_name: string;
  project_name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  client_name: string;
  project_name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "client_name"
  | "project_name"
  | "start_date"
  | "due_date"
  | "priority";

export interface ProjectQueryParams {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  sort?: SortOption;
}
