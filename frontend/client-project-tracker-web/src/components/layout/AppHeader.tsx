import { useState } from "react";
import { FolderKanban, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-10">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Open navigation menu"
              className="lg:hidden"
            />
          }
        >
          <Menu className="size-4.5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation for Client Project Tracker
          </SheetDescription>
          <AppSidebar onNavigate={() => setOpen(false)} className="h-full" />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FolderKanban className="size-3.5" />
        </span>
        <span className="font-heading text-sm font-semibold tracking-tight">
          Client Tracker
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
      </div>
    </header>
  );
}
