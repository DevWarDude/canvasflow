"use client";

import type { ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";

import { getEditorDocument } from "../lib/editor-document-repository";

import { EditorStoreProvider } from "../store/editor-store-provider";
import { EditorHistoryShortcuts } from "./editor-history-shortcuts";

interface EditorSessionProps {
  projectId: string;
  children: ReactNode;
}

export function EditorSession({ projectId, children }: EditorSessionProps) {
  const {
    data: savedDocument,
    isPending,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["editor-document", projectId],

    queryFn: () => getEditorDocument(projectId),

    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Wait for the IndexedDB read to finish.
  if (isPending || isFetching) {
    return (
      <div
        role="status"
        className="grid min-h-dvh place-items-center bg-canvas-editor text-white"
      >
        Loading your document...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="grid min-h-dvh place-items-center bg-canvas-editor p-6 text-center text-white"
      >
        <div>
          <h1 className="text-lg font-semibold">
            Unable to load your document
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Your saved work could not be loaded. Please check browser storage
            permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EditorStoreProvider
      key={projectId}
      projectId={projectId}
      initialDocument={savedDocument ?? null}
    >
      <EditorHistoryShortcuts />
      {children}
    </EditorStoreProvider>
  );
}
