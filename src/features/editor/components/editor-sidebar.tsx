"use client";

import {
  Type,
  AlignLeft,
  MousePointer2,
  ImageIcon,
  Square,
  Layers3,
  type LucideIcon,
} from "lucide-react";

import { DragDropProvider } from "@dnd-kit/react";

import { isSortable } from "@dnd-kit/react/sortable";

import type { EditorComponentType } from "../types/editor-document";

import { useEditorStore } from "../store/editor-store-provider";

import { SortableLayerItem } from "./sortable-layer-item";

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
  const components = useEditorStore((state) => state.document.components);

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const addComponent = useEditorStore((state) => state.addComponent);

  const selectComponent = useEditorStore((state) => state.selectComponent);

  const removeComponent = useEditorStore((state) => state.removeComponent);

  const moveComponent = useEditorStore((state) => state.moveComponent);

  const reorderComponent = useEditorStore((state) => state.reorderComponent);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-canvas-editor-border bg-canvas-editor-panel">
      {/* COMPONENT LIBRARY */}
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

                <span className="text-xs">{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* LAYERS PANEL */}
      <section className="flex h-64 shrink-0 flex-col border-t border-canvas-editor-border p-4">
        <div className="mb-4 flex items-center gap-2">
          <Layers3 className="size-4 text-gray-400" />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Layers
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {components.length === 0 ? (
            <p className="text-xs text-gray-500">No components added yet.</p>
          ) : (
            <DragDropProvider
              onDragEnd={(event) => {
                if (event.canceled) {
                  return;
                }

                const { source } = event.operation;

                if (!isSortable(source)) {
                  return;
                }

                const { initialIndex, index } = source;

                if (initialIndex !== index) {
                  reorderComponent(initialIndex, index);
                }
              }}
            >
              <div className="flex flex-col gap-2">
                {components.map((component, index) => (
                  <SortableLayerItem
                    key={component.id}
                    component={component}
                    index={index}
                    total={components.length}
                    isSelected={selectedComponentId === component.id}
                    onSelect={() => selectComponent(component.id)}
                    onMove={(direction) =>
                      moveComponent(component.id, direction)
                    }
                    onDelete={() => removeComponent(component.id)}
                  />
                ))}
              </div>
            </DragDropProvider>
          )}
        </div>
      </section>
    </aside>
  );
}
