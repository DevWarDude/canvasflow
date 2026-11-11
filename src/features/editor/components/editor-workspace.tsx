"use client";

import { Fragment, useState } from "react";

import { useDroppable } from "@dnd-kit/react";

import {
  LayoutTemplate,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Pencil,
} from "lucide-react";

import { useEditorStore } from "../store/editor-store-provider";

import { CanvasInsertionSlot } from "./canvas-insertion-slot";
import { ComponentPreview } from "./component-preview";
import { SortableCanvasItem } from "./sortable-canvas-item";


// VIEWPORT CONFIGURATION


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


// EDITOR WORKSPACE


export function EditorWorkspace() {
  
  // ZUSTAND EDITOR STATE
  

  const components = useEditorStore(
    (state) => state.document.components,
  );

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const selectComponent = useEditorStore(
    (state) => state.selectComponent,
  );

  
  // LOCAL UI STATE
  

  const [viewport, setViewport] =
    useState<ViewportMode>("desktop");

  const [isPreview, setIsPreview] = useState(false);

  
  // CURRENT VIEWPORT
  

  const currentViewport =
    viewportOptions.find(
      (option) => option.id === viewport,
    ) ?? viewportOptions[0];

  
  // CANVAS DRAG AND DROP
  

  const { ref: canvasRef, isDropTarget } = useDroppable({
    id: "editor-canvas",
    type: "canvas",
    accept: "library-component",
    disabled: isPreview,
  });

  
  // RENDER
  

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-canvas-workspace">
      {/* 
          WORKSPACE HEADER
       */}

      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4">
        {/* Left: Canvas Information */}

        <div className="shrink-0">
          <h2 className="text-xs font-semibold text-gray-700">
            Canvas
          </h2>

          <p className="mt-1 text-[11px] text-gray-500">
            {viewport === "desktop"
              ? "Up to 1100px"
              : `${currentViewport.width}px`}
          </p>
        </div>

        {/* Right: Viewport + Preview Controls */}

        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          {/* 
              VIEWPORT SWITCHER
           */}

          <div
            role="group"
            aria-label="Canvas viewport size"
            className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white p-1"
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

                  <span className="hidden xl:inline">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 
              PREVIEW TOGGLE
           */}

          <button
            type="button"
            onClick={() =>
              setIsPreview((previous) => !previous)
            }
            aria-pressed={isPreview}
            className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              isPreview
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isPreview ? (
              <>
                <Pencil className="size-4" />
                <span>Back to Edit</span>
              </>
            ) : (
              <>
                <Eye className="size-4" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 
          WORKSPACE CONTENT
       */}

      <div className="min-h-0 flex-1 overflow-auto p-8">
        {/* 
            WEBSITE CANVAS
         */}

        <div
          ref={canvasRef}
          style={{
            width:
              viewport === "desktop"
                ? "100%"
                : `${currentViewport.width}px`,

            maxWidth:
              viewport === "desktop"
                ? "1100px"
                : undefined,
          }}
          className={`relative mx-auto min-h-[650px] rounded-lg border bg-white shadow-xl transition-[width] duration-300 ${
            !isPreview && isDropTarget
              ? "border-indigo-500 ring-4 ring-indigo-500/20"
              : "border-gray-200"
          }`}
        >
          {/* 
              CANVAS DROP INDICATOR
           */}

          {!isPreview && isDropTarget && (
            <div className="pointer-events-none absolute inset-2 z-10 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-500/5" />
          )}

          {/* 
              PREVIEW MODE
           */}

          {isPreview ? (
            <div className="space-y-5 p-8">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="min-w-0 break-words"
                >
                  <ComponentPreview component={component} />
                </div>
              ))}
            </div>
          ) : components.length === 0 ? (
            /* 
                EMPTY CANVAS STATE
             */

            <div className="flex min-h-[650px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#635BFF]/10">
                <LayoutTemplate className="size-8 text-[#635BFF]" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Your canvas is ready
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                Start building by adding components from the
                left sidebar.
              </p>
            </div>
          ) : (
            /* 
                EDIT MODE
             */

            <div className="flex flex-col p-8">
              {/* Insert before the first component */}

              <CanvasInsertionSlot index={0} />

              {/* Render editable components */}

              {components.map((component, index) => (
                <Fragment key={component.id}>
                  {/* Sortable canvas component */}

                  <SortableCanvasItem
                    component={component}
                    index={index}
                    isSelected={
                      selectedComponentId === component.id
                    }
                    onSelect={() =>
                      selectComponent(component.id)
                    }
                  />

                  {/* Insert after this component */}

                  <CanvasInsertionSlot
                    index={index + 1}
                  />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}