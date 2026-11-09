import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { FolderOpen } from "lucide-react";

export function EmptyProjects() {
  return (
    <Card className="mt-10 border-dashed shadow-none">

      <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">

        {/* Empty State Icon */}
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">

          <FolderOpen className="size-8 text-primary" />

        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold tracking-tight">
          Your workspace is empty
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Every great website starts with an idea.
          Create your first project and start bringing
          your designs to life.
        </p>

        {/* Additional Information */}
        <p className="mt-6 text-xs text-muted-foreground">
          Project creation is coming next.
        </p>

      </CardContent>

    </Card>
  );
}