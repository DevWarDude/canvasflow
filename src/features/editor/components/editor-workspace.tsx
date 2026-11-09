"use client";

import { LayoutTemplate } from "lucide-react";

import { useEditorStore } from "../store/editor-store-provider";
import { useDroppable } from "@dnd-kit/react";
import { CanvasInsertionSlot } from "./canvas-insertion-slot";
import { Fragment } from "react";

import { SortableCanvasItem } from "./sortable-canvas-item";

export function EditorWorkspace() {
  const components = useEditorStore((state) => state.document.components);

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const selectComponent = useEditorStore((state) => state.selectComponent);

  const { ref: canvasRef, isDropTarget } = useDroppable({
    id: "editor-canvas",
    type: "canvas",
    accept: "library-component",
  });

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-canvas-workspace">
      {/* Workspace Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-6">
        <span className="text-xs font-medium text-gray-600">Canvas</span>

        <span className="text-xs text-gray-500">Desktop View</span>
      </div>

      {/* Workspace Content */}
      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-8">
        <div
          ref={canvasRef}
          className={`relative min-h-[650px] w-full max-w-3xl self-start rounded-lg border bg-white shadow-xl transition-all ${
            isDropTarget
              ? "border-indigo-500 ring-4 ring-indigo-500/20"
              : "border-gray-200"
          }`}
        >
          {/* Visual feedback when a component is dragged over the canvas */}
          {isDropTarget && (
            <div className="pointer-events-none absolute inset-2 z-10 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-500/5" />
          )}
          {components.length === 0 ? (
            <div className="flex min-h-[650px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#635BFF]/10">
                <LayoutTemplate className="size-8 text-[#635BFF]" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Your canvas is ready
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                Start building by adding components from the left sidebar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col p-8">
              {/* Drop a new component before the first component */}
              <CanvasInsertionSlot index={0} />

              {components.map((component, index) => (
                <Fragment key={component.id}>
                  {/* Existing component can now be dragged */}
                  <SortableCanvasItem
                    component={component}
                    index={index}
                    isSelected={selectedComponentId === component.id}
                    onSelect={() => selectComponent(component.id)}
                  />

                  {/* Drop new components after this component */}
                  <CanvasInsertionSlot index={index + 1} />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
