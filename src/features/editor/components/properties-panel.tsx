"use client";

import { SlidersHorizontal } from "lucide-react";

import { useEditorStore } from "../store/editor-store-provider";

export function PropertiesPanel() {
  const components = useEditorStore(
    (state) => state.document.components
  );

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const selectedComponent = components.find(
    (component) => component.id === selectedComponentId
  );

  return (
    <aside className="w-72 shrink-0 border-l border-canvas-editor-border bg-canvas-editor-panel">
      <div className="flex h-14 items-center gap-3 border-b border-canvas-editor-border px-5">
        <SlidersHorizontal className="size-4 text-gray-400" />

        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Properties
        </h2>
      </div>

      {!selectedComponent ? (
        <div className="px-6 py-16 text-center">
          <h3 className="text-sm font-medium text-white">
            Nothing selected
          </h3>

          <p className="mt-3 text-xs leading-5 text-gray-400">
            Select a component to view its properties.
          </p>
        </div>
      ) : (
        <div className="space-y-5 p-5">
          <div>
            <p className="text-xs text-gray-400">
              Component Type
            </p>

            <p className="mt-2 text-sm font-medium capitalize text-white">
              {selectedComponent.type}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Component ID
            </p>

            <p className="mt-2 break-all text-xs text-gray-300">
              {selectedComponent.id}
            </p>
          </div>

          <p className="border-t border-canvas-editor-border pt-5 text-xs leading-5 text-gray-400">
            Style and content editing controls
            will be added in the next milestone.
          </p>
        </div>
      )}
    </aside>
  );
}