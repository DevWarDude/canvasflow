"use client";

import { Button } from "@/components/ui/button";

import { CreateProjectDialog } from "./create-project-dialog";
import { EmptyProjects } from "./empty-projects";
import { ProjectGrid } from "./project-grid";

import { useProjects } from "../hooks/use-projects";

export function ProjectsContent() {
  const {
    data: projects = [],
    isPending,
    isError,
    refetch,
  } = useProjects();

  return (
    <>
      {/* Dashboard Heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Projects
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Create and manage your websites in one place.
          </p>
        </div>

        <CreateProjectDialog />
      </div>

      {/* Loading State */}
      {isPending && (
        <div
          role="status"
          className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
          <span className="sr-only">Loading projects...</span>
        </div>
      )}

      {/* Error State */}
      {!isPending && isError && (
        <div className="mt-10 rounded-xl border p-8 text-center">
          <h2 className="font-semibold">
            Unable to load projects
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please check your browser storage settings.
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() => void refetch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Project Content */}
      {!isPending && !isError && (
        projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <ProjectGrid projects={projects} />
        )
      )}
    </>
  );
}