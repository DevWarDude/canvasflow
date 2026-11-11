"use client";

import { LayoutTemplate } from "lucide-react";

import { useEditorStore } from "../store/editor-store-provider";
import { useDroppable } from "@dnd-kit/react";
import { CanvasInsertionSlot } from "./canvas-insertion-slot";
import { Fragment } from "react";
import { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";

import { SortableCanvasItem } from "./sortable-canvas-item";

const viewportOptions = [
  {
    id: "desktop",
    label: "Desktop",
    width: 1100,
    icon: Monitor,
  },
  {
    id: "tablet",
    label: "Tablet",
    width: 768,
    icon: Tablet,
  },
  {
    id: "mobile",
    label: "Mobile",
    width: 390,
    icon: Smartphone,
  },
] as const;

type ViewportMode = (typeof viewportOptions)[number]["id"];

export function EditorWorkspace() {
  const components = useEditorStore((state) => state.document.components);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  const currentViewport =
    viewportOptions.find((option) => option.id === viewport) ??
    viewportOptions[0];

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
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4">
        <div>
          <h2 className="text-xs font-semibold text-gray-700">Canvas</h2>

          <p className="mt-1 text-[11px] text-gray-500">
            {viewport === "desktop"
              ? "Up to 1100px"
              : `${currentViewport.width}px`}
          </p>
        </div>

        <div
          role="group"
          aria-label="Canvas viewport size"
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1"
        >
          {viewportOptions.map((option) => {
            const Icon = option.icon;

            const isActive = viewport === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setViewport(option.id)}
                aria-label={`${option.label} viewport`}
                aria-pressed={isActive}
                title={option.label}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="size-4" />

                <span className="hidden xl:inline">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Content */}
      <div className="min-h-0 flex-1 overflow-auto p-8">
        <div
          ref={canvasRef}
          style={{
            width:
              viewport === "desktop" ? "100%" : `${currentViewport.width}px`,

            maxWidth: viewport === "desktop" ? "1100px" : undefined,
          }}
          className={`relative mx-auto min-h-[650px] rounded-lg border bg-white shadow-xl transition-[width] duration-300 ${
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
