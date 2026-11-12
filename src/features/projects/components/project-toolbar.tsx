"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type ProjectSortOption =
  "updated-desc" | "updated-asc" | "name-asc" | "name-desc";

interface ProjectToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: ProjectSortOption;
  onSortChange: (value: ProjectSortOption) => void;
  totalCount: number;
  resultCount: number;
}

export function ProjectToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
  resultCount,
}: ProjectToolbarProps) {
  return (
    <div className="mt-10 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>

          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="project-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects..."
            className="pl-10 pr-10"
            autoComplete="off"
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
              onClick={() => onSearchChange("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="project-sort"
            className="shrink-0 text-sm text-muted-foreground"
          >
            Sort by
          </label>

          <select
            id="project-sort"
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as ProjectSortOption)
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="updated-desc">Recently Updated</option>

            <option value="updated-asc">Least Recently Updated</option>

            <option value="name-asc">Name: A to Z</option>

            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Result Count */}
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-muted-foreground"
      >
        {search.trim()
          ? `${resultCount} of ${totalCount} projects`
          : `${totalCount} ${totalCount === 1 ? "project" : "projects"}`}
      </p>
    </div>
  );
}
