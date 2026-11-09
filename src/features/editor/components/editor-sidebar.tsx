"use client";

import {
  Type,
  AlignLeft,
  MousePointer2,
  ImageIcon,
  Square,
  Layers3,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import type {
  EditorComponentType,
} from "../types/editor-document";

import { useEditorStore } from "../store/editor-store-provider";

interface LibraryItem {
  name: string;
  type: EditorComponentType;
  icon: LucideIcon;
}

const libraryItems: LibraryItem[] = [
  {
    name: "Heading",
    type: "heading",
    icon: Type,
  },
  {
    name: "Paragraph",
    type: "paragraph",
    icon: AlignLeft,
  },
  {
    name: "Button",
    type: "button",
    icon: MousePointer2,
  },
  {
    name: "Image",
    type: "image",
    icon: ImageIcon,
  },
  {
    name: "Section",
    type: "section",
    icon: Square,
  },
];

export function EditorSidebar() {
  const components = useEditorStore(
    (state) => state.document.components
  );

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const addComponent = useEditorStore(
    (state) => state.addComponent
  );

  const selectComponent = useEditorStore(
    (state) => state.selectComponent
  );

  const removeComponent = useEditorStore(
    (state) => state.removeComponent
  );

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-canvas-editor-border bg-canvas-editor-panel">
      {/* Component Library */}
      <section className="min-h-0 flex-1 overflow-y-auto p-4">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Components
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {libraryItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.type}
                type="button"
                onClick={() => addComponent(item.type)}
                className="flex h-24 flex-col items-center justify-center gap-3 rounded-xl border border-canvas-editor-border bg-white/5 text-gray-300 transition-colors hover:border-indigo-500 hover:bg-white/10"
              >
                <Icon className="size-5" />

                <span className="text-xs">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Layers */}
      <section className="flex h-64 shrink-0 flex-col border-t border-canvas-editor-border p-4">
        <div className="mb-4 flex items-center gap-2">
          <Layers3 className="size-4 text-gray-400" />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Layers
          </h2>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {components.length === 0 ? (
            <p className="text-xs text-gray-500">
              No components added yet.
            </p>
          ) : (
            components.map((component, index) => (
              <div
                key={component.id}
                className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
                  selectedComponentId === component.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-canvas-editor-border bg-white/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    selectComponent(component.id)
                  }
                  className="min-w-0 flex-1 truncate text-left text-xs capitalize text-gray-200"
                >
                  {index + 1}. {component.type}
                </button>

                <button
                  type="button"
                  aria-label={`Delete ${component.type}`}
                  onClick={() =>
                    removeComponent(component.id)
                  }
                  className="rounded p-1 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  );
}