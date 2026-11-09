"use client";

import Link from "next/link";

import { useProjects } from "@/features/projects/hooks/use-projects";

import { EditorToolbar } from "./editor-toolbar";
import { EditorSidebar } from "./editor-sidebar";
import { EditorWorkspace } from "./editor-workspace";
import { PropertiesPanel } from "./properties-panel";
import { EditorSession } from "./editor-session";

interface EditorShellProps {
  projectId: string;
}

export function EditorShell({ projectId }: EditorShellProps) {
  const {
    data: projects,
    isPending,
    isError,
  } = useProjects();

  // Loading
  if (isPending) {
    return (
      <div
        role="status"
        className="grid min-h-dvh place-items-center bg-canvas-editor text-white"
      >
        Loading editor...
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas-editor p-6 text-center text-white">
        <div>
          <h1 className="text-xl font-semibold">
            Unable to load project
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Check your browser storage settings.
          </p>

          <Link
            href="/projects"
            className="mt-6 inline-block text-sm text-indigo-400"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const project = projects?.find(
    (item) => item.id === projectId
  );

  // Project not found
  if (!project) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas-editor p-6 text-center text-white">
        <div>
          <h1 className="text-xl font-semibold">
            Project not found
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            This project does not exist in your local workspace.
          </p>

          <Link
            href="/projects"
            className="mt-6 inline-block text-sm text-indigo-400"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
     <EditorSession
    key={project.id}
    projectId={project.id}
  >
 
      {/* Mobile / Tablet Message */}
      <div className="grid min-h-dvh place-items-center bg-canvas-editor p-6 text-center text-white lg:hidden">
        <div>
          <h1 className="text-xl font-semibold">
            CanvasFlow Editor
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
            The visual editor is currently optimized
            for desktop screens.
          </p>

          <Link
            href="/projects"
            className="mt-6 inline-block text-sm text-indigo-400"
          >
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Desktop Editor */}
      <div className="hidden h-dvh flex-col overflow-hidden bg-canvas-editor text-white lg:flex">

        <EditorToolbar projectName={project.name} />

        <div className="flex min-h-0 flex-1">
          <EditorSidebar />

          <EditorWorkspace />

          <PropertiesPanel />
        </div>

      </div>
 
  </EditorSession>
  );
}