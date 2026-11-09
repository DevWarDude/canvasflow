import Link from "next/link";

import {
  FolderKanban,
  HardDrive,
  Layers3,
  Settings2,
} from "lucide-react";

export function DashboardSidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r bg-card lg:sticky lg:top-0 lg:flex">

      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Layers3 className="size-5" />
        </div>

        <span className="text-lg font-bold tracking-tight">
          CanvasFlow
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col px-3 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <nav aria-label="Dashboard navigation" className="space-y-1">

          <Link
            href="/projects"
            aria-current="page"
            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors"
          >
            <FolderKanban className="size-4" />
            Projects
          </Link>

          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground opacity-60"
          >
            <span className="flex items-center gap-3">
              <Settings2 className="size-4" />
              Settings
            </span>

            <span className="text-xs">Soon</span>
          </button>

        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t p-4">

        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">

          <div className="flex size-9 items-center justify-center rounded-lg bg-background">
            <HardDrive className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium">
              Local Workspace
            </p>

            <p className="text-xs text-muted-foreground">
              Guest mode
            </p>
          </div>

        </div>

      </div>
    </aside>
  );
}