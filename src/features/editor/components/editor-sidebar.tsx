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

import type {
  EditorComponentType,
} from "../types/editor-document";

import { useEditorStore } from "../store/editor-store-provider";

import { DraggableLibraryItem } from "./draggable-library-item";
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

  const moveComponent = useEditorStore(
    (state) => state.moveComponent
  );

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-canvas-editor-border bg-canvas-editor-panel">
      {/* COMPONENT LIBRARY */}
      <section className="min-h-0 flex-1 overflow-y-auto p-4">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Components
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {libraryItems.map((item) => (
            <DraggableLibraryItem
              key={item.type}
              name={item.name}
              type={item.type}
              icon={item.icon}
              onAdd={addComponent}
            />
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-gray-500">
          Click to add, or use the grip icon
          to drag a component onto the canvas.
        </p>
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
            <p className="text-xs text-gray-500">
              No components added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {components.map((component, index) => (
                <SortableLayerItem
                  key={component.id}
                  component={component}
                  index={index}
                  total={components.length}
                  isSelected={
                    selectedComponentId === component.id
                  }
                  onSelect={() =>
                    selectComponent(component.id)
                  }
                  onMove={(direction) =>
                    moveComponent(
                      component.id,
                      direction
                    )
                  }
                  onDelete={() =>
                    removeComponent(component.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}