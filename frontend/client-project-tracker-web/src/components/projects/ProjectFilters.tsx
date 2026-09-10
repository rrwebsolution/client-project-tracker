import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type ProjectPriority,
  type ProjectStatus,
  type SortOption,
} from "@/types/project";

export interface ProjectFilterState {
  search: string;
  status: ProjectStatus | "all";
  priority: ProjectPriority | "all";
  sort: SortOption;
}

const STATUS_OPTIONS: ComboboxOption[] = [
  { value: "all", label: "All Statuses" },
  ...PROJECT_STATUSES.map((status) => ({ value: status, label: status })),
];

const PRIORITY_OPTIONS: ComboboxOption[] = [
  { value: "all", label: "All Priorities" },
  ...PROJECT_PRIORITIES.map((priority) => ({ value: priority, label: priority })),
];

const SORT_OPTIONS: ComboboxOption[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "client_name", label: "Client Name" },
  { value: "project_name", label: "Project Name" },
  { value: "start_date", label: "Start Date" },
  { value: "due_date", label: "Due Date" },
  { value: "priority", label: "Priority" },
];

export const DEFAULT_FILTERS: ProjectFilterState = {
  search: "",
  status: "all",
  priority: "all",
  sort: "newest",
};

interface ProjectFiltersProps {
  value: ProjectFilterState;
  onChange: (value: ProjectFilterState) => void;
}

export function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  const isFiltered =
    value.search !== "" ||
    value.status !== "all" ||
    value.priority !== "all" ||
    value.sort !== "newest";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          placeholder="Search clients or projects..."
          className="pl-8"
          aria-label="Search clients or projects"
        />
      </div>

      <Combobox
        value={value.status}
        onValueChange={(status) =>
          onChange({ ...value, status: status as ProjectFilterState["status"] })
        }
        options={STATUS_OPTIONS}
        placeholder="All Statuses"
        searchPlaceholder="Search status..."
        aria-label="Filter by status"
        className="sm:w-40"
      />

      <Combobox
        value={value.priority}
        onValueChange={(priority) =>
          onChange({ ...value, priority: priority as ProjectFilterState["priority"] })
        }
        options={PRIORITY_OPTIONS}
        placeholder="All Priorities"
        searchPlaceholder="Search priority..."
        aria-label="Filter by priority"
        className="sm:w-40"
      />

      <Combobox
        value={value.sort}
        onValueChange={(sort) => onChange({ ...value, sort: sort as SortOption })}
        options={SORT_OPTIONS}
        placeholder="Sort by..."
        searchPlaceholder="Search sort..."
        aria-label="Sort projects"
        className="sm:w-40"
      />

      {isFiltered && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-muted-foreground"
        >
          <X className="size-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
