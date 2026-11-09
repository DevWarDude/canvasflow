"use client";

import { GripVertical } from "lucide-react";

import { useSortable } from "@dnd-kit/react/sortable";

import type { EditorComponent } from "../types/editor-document";

import { ComponentPreview } from "./component-preview";

interface SortableCanvasItemProps {
  component: EditorComponent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function SortableCanvasItem({
  component,
  index,
  isSelected,
  onSelect,
}: SortableCanvasItemProps) {
  const { ref, handleRef, isDragSource, isDropTarget } = useSortable({
    id: `canvas:${component.id}`,
    index,
    group: "canvas",
    type: "canvas-component",
    accept: "canvas-component",
  });

  return (
    <div
      ref={ref}
      className={`group relative rounded-md transition-colors ${
        isDragSource ? "opacity-50" : ""
      } ${isDropTarget ? "bg-indigo-50" : ""}`}
    >
      {/* Drag Handle */}
      <button
        ref={handleRef}
        type="button"
        title="Drag to reorder component"
        aria-label={`Drag ${component.type} to another position`}
        className="absolute right-2 top-2 z-20 cursor-grab touch-none rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 opacity-0 shadow-sm transition-opacity hover:bg-indigo-50 hover:text-indigo-600 focus:opacity-100 group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Component Selection */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Select ${component.type} component`}
        aria-pressed={isSelected}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
        className={`cursor-pointer rounded-md p-3 text-gray-900 outline-none transition-all ${
          isSelected
            ? "ring-2 ring-indigo-500"
            : "hover:ring-1 hover:ring-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
        }`}
      >
        <ComponentPreview component={component} />
      </div>
    </div>
  );
}
