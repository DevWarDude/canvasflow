"use client";

import { useState } from "react";

import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";

import {
  ArrowLeft,
  Eye,
  Save,
  Layers3,
  Undo2,
  Redo2,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { saveEditorDocument } from "../lib/editor-document-repository";

import { useEditorStore } from "../store/editor-store-provider";
import { generateHtmlDocument } from "../lib/export-html";

interface EditorToolbarProps {
  projectName: string;
}

export function EditorToolbar({ projectName }: EditorToolbarProps) {
  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [exportError, setExportError] = useState<string | null>(null);

  const beginSave = useEditorStore((state) => state.beginSave);

  const canUndo = useEditorStore((state) => state.past.length > 0);

  const canRedo = useEditorStore((state) => state.future.length > 0);

  const undo = useEditorStore((state) => state.undo);

  const redo = useEditorStore((state) => state.redo);

  const document = useEditorStore((state) => state.document);

  const isDirty = useEditorStore((state) => state.isDirty);

  const markSaved = useEditorStore((state) => state.markSaved);

  async function handleSave() {
    if (!isDirty || isSaving) {
      return;
    }

    const documentToSave = document;

    // End the current typing/style history group.
    beginSave();

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveEditorDocument(documentToSave);

      queryClient.setQueryData(
        ["editor-document", documentToSave.projectId],
        documentToSave,
      );

      markSaved(documentToSave);
    } catch (error) {
      console.error("Unable to save document:", error);

      setSaveError("Save failed. Your changes are still unsaved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleExport() {
    if (isExporting) return;

    setIsExporting(true);
    setExportError(null);

    try {
      // Generate HTML and embed stored images.
      const html = await generateHtmlDocument(document, projectName);

      const blob = new Blob([html], {
        type: "text/html;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const filename =
        projectName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-_]+/g, "-")
          .replace(/^-+|-+$/g, "") || "canvasflow-website";

      const link = window.document.createElement("a");

      link.href = url;
      link.download = `${filename}.html`;

      window.document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Unable to export website:", error);

      setExportError("Website export failed.");
    } finally {
      setIsExporting(false);
    }
  }

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
          <p className="text-xs text-gray-400">CanvasFlow / Editor</p>

          <h1 className="truncate text-sm font-semibold text-white">
            {projectName}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div
          aria-live="polite"
          className="hidden max-w-56 text-right text-xs sm:block"
        >
          {saveError ? (
            <span className="text-red-400">{saveError}</span>
          ) : isSaving ? (
            <span className="text-gray-400">Saving...</span>
          ) : isDirty ? (
            <span className="text-amber-400">Unsaved changes</span>
          ) : (
            <span className="text-gray-400">No unsaved changes</span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
          className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <Undo2 className="size-4" />
          Undo
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo (Ctrl+Shift+Z)"
          className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <Redo2 className="size-4" />
          Redo
        </Button>

        <Button
          variant="outline"
          disabled
          className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <Eye className="size-4" />
          Preview
        </Button>

        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          <Save className="size-4" />

          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleExport}
          disabled={isExporting || document.components.length === 0}
          className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <Download className="size-4" />

          {isExporting ? "Exporting..." : "Export HTML"}
        </Button>
        {exportError && (
          <span role="alert" className="text-xs text-red-400">
            {exportError}
          </span>
        )}
      </div>
    </header>
  );
}
