import { ProjectActions } from "./project-actions";
import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { ProjectSummary } from "../types/project";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.updatedAt));

  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Project Preview */}
      <div className="flex h-48 items-center justify-center overflow-hidden bg-muted/60 p-5">

        <div className="h-full w-full max-w-[280px] overflow-hidden rounded-t-lg border bg-white shadow-sm">

          {/* Mock Browser Header */}
          <div className="flex h-7 items-center gap-1.5 border-b px-3">
            <span className="size-1.5 rounded-full bg-red-300" />
            <span className="size-1.5 rounded-full bg-yellow-300" />
            <span className="size-1.5 rounded-full bg-green-300" />
          </div>

          {/* Mock Website Content */}
          <div className="space-y-3 p-5">

            <div className="h-2 w-20 rounded bg-primary/30" />

            <div className="space-y-2">
              <div className="h-3 w-4/5 rounded bg-slate-200" />
              <div className="h-3 w-3/5 rounded bg-slate-200" />
            </div>

            <div className="h-5 w-20 rounded bg-primary" />

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
              <div className="h-12 rounded bg-slate-100" />
            </div>

          </div>
        </div>
      </div>

      {/* Project Information */}
      <CardContent className="flex items-center justify-between gap-3 p-4">

        <div className="min-w-0">

          <h3 className="truncate text-sm font-semibold">
  <Link
    href={`/projects/${project.id}/editor`}
    className="transition-colors hover:text-primary hover:underline"
  >
    {project.name}
  </Link>
</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Edited {formattedDate}
          </p>

        </div>

   <ProjectActions project={project} />

      </CardContent>

    </Card>
  );
}