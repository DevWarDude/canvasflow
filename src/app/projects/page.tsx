import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DashboardSidebar } from "@/features/projects/components/dashboard-sidebar";

import { DashboardHeader } from "@/features/projects/components/dashboard-header";

import { EmptyProjects } from "@/features/projects/components/empty-projects";

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-canvas-dashboard">

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <DashboardHeader />

        {/* Dashboard Content */}
        <main className="flex-1">

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

            {/* Page Heading */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My Projects
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create and manage your websites in one place.
                </p>
              </div>

              {/* New Project Button */}
              <Button
                disabled
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />

                New Project
              </Button>

            </div>

            {/* Projects Content */}
            <EmptyProjects />

          </div>

        </main>

      </div>

    </div>
  );
}