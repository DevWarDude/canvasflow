import { DashboardSidebar } from "@/features/projects/components/dashboard-sidebar";

import { DashboardHeader } from "@/features/projects/components/dashboard-header";

import { ProjectsContent } from "@/features/projects/components/projects-content";

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-canvas-dashboard">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
            <ProjectsContent />
          </div>
        </main>
      </div>
    </div>
  );
}
