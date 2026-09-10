import { FolderKanban, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", to: "/", icon: LayoutDashboard, end: true },
  { label: "Projects", to: "/projects", icon: FolderKanban, end: false },
];

interface AppSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <FolderKanban className="size-4" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
            Client Tracker
          </p>
          <p className="truncate text-[11px] text-sidebar-foreground/55">
            Project Management
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-3">
        <p className="px-2.5 pb-2 text-[11px] font-medium tracking-wider text-sidebar-foreground/45">
          WORKSPACE
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("size-4", isActive ? "text-primary" : "text-current")}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-sidebar-border px-5 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
          PM
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            Project Manager
          </p>
          <p className="truncate text-xs text-sidebar-foreground/55">Digital Agency</p>
        </div>
      </div>
    </div>
  );
}
