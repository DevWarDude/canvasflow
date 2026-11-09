"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { CreateProjectDialog } from "./create-project-dialog";
import { EmptyProjects } from "./empty-projects";
import { ProjectGrid } from "./project-grid";

import {
  ProjectToolbar,
  type ProjectSortOption,
} from "./project-toolbar";

import { useProjects } from "../hooks/use-projects";

export function ProjectsContent() {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useProjects();

  // Local UI state
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] =
    useState<ProjectSortOption>("updated-desc");

  // Derive the visible projects from saved data and UI state
  const filteredProjects = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const results = (data ?? []).filter((project) =>
      project.name.toLowerCase().includes(searchTerm)
    );

    return results.sort((a, b) => {
      switch (sortBy) {
        case "updated-desc":
          return (
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
          );

        case "updated-asc":
          return (
            new Date(a.updatedAt).getTime() -
            new Date(b.updatedAt).getTime()
          );

        case "name-asc":
          return a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          });

        case "name-desc":
          return b.name.localeCompare(a.name, undefined, {
            sensitivity: "base",
          });

        default:
          return 0;
      }
    });
  }, [data, search, sortBy]);

  const totalCount = data?.length ?? 0;

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

      {/* Loading */}
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
          <span className="sr-only">
            Loading projects...
          </span>
        </div>
      )}

      {/* Error */}
      {!isPending && isError && (
        <div className="mt-10 rounded-xl border bg-card p-8 text-center">
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

      {/* Success */}
      {!isPending && !isError && (
        <>
          {totalCount === 0 ? (
            <EmptyProjects />
          ) : (
            <>
              <ProjectToolbar
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalCount={totalCount}
                resultCount={filteredProjects.length}
              />

              {filteredProjects.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
                  <h2 className="text-lg font-semibold">
                    No matching projects
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Try searching for a different project name.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => setSearch("")}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <ProjectGrid projects={filteredProjects} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}