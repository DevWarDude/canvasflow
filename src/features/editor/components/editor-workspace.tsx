"use client";

import { LayoutTemplate } from "lucide-react";

import { useEditorStore } from "../store/editor-store-provider";
import { ComponentPreview } from "./component-preview";

export function EditorWorkspace() {
  const components = useEditorStore((state) => state.document.components);

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const selectComponent = useEditorStore((state) => state.selectComponent);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-canvas-workspace">
      {/* Workspace Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-6">
        <span className="text-xs font-medium text-gray-600">Canvas</span>

        <span className="text-xs text-gray-500">Desktop View</span>
      </div>

      {/* Workspace Content */}
      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-8">
        <div className="min-h-[650px] w-full max-w-3xl self-start rounded-lg border border-gray-200 bg-white shadow-xl">
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
            <div className="space-y-5 p-8">
              {components.map((component) => {
                const isSelected = selectedComponentId === component.id;

                return (
                  <div
                    key={component.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${component.type} component`}
                    aria-pressed={isSelected}
                    onClick={() => selectComponent(component.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectComponent(component.id);
                      }
                    }}
                    className={`cursor-pointer rounded-md p-2 text-gray-900 outline-none transition-all ${
                      isSelected
                        ? "ring-2 ring-indigo-500"
                        : "hover:ring-1 hover:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
                    }`}
                  >
                    <ComponentPreview component={component} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
