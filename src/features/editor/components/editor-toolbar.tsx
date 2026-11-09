import Link from "next/link";

import {
  ArrowLeft,
  Eye,
  Save,
  Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  projectName: string;
}

export function EditorToolbar({
  projectName,
}: EditorToolbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-canvas-editor-border bg-canvas-editor-panel px-5">

      {/* Left */}
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/projects"
          aria-label="Back to projects"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Layers3 className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            CanvasFlow / Editor
          </p>

          <h1 className="truncate text-sm font-semibold text-white">
            {projectName}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button variant="outline" disabled>
          <Eye className="size-4" />
          Preview
        </Button>

        <Button disabled>
          <Save className="size-4" />
          Save
        </Button>
      </div>
    </header>
  );
}