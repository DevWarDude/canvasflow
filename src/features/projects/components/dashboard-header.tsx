import {
  Layers3,
  HardDrive,
} from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-10">

      {/* Mobile Branding */}
      <div className="flex items-center gap-3 lg:hidden">

        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Layers3 className="size-4" />
        </div>

        <span className="font-semibold tracking-tight">
          CanvasFlow
        </span>

      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden items-center gap-2 text-sm lg:flex">

        <span className="text-muted-foreground">
          Workspace
        </span>

        <span className="text-muted-foreground">
          /
        </span>

        <span className="font-medium">
          Projects
        </span>

      </div>

      {/* Workspace Information */}
      <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">

        <HardDrive className="size-3.5 text-muted-foreground" />

        <span className="text-xs font-medium text-muted-foreground">
          Local workspace
        </span>

      </div>

    </header>
  );
}