"use client";

import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";

import { useSortable } from "@dnd-kit/react/sortable";

import type { EditorComponent } from "../types/editor-document";

interface SortableLayerItemProps {
  component: EditorComponent;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (direction: "up" | "down") => void;
  onDelete: () => void;
}



export function SortableLayerItem({
  component,
  index,
  total,
  isSelected,
  onSelect,
  onMove,
  onDelete,
}: SortableLayerItemProps) {

const {
  ref,
  handleRef,
  isDragSource,
  isDropTarget,
} = useSortable({
  id: component.id,
  index,
  type: "layer-component",
  accept: "layer-component",
});
  return (
    <div
      ref={ref}
      className={`flex items-center gap-1 rounded-lg border px-2 py-2 transition-colors ${
        isSelected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-canvas-editor-border bg-white/5"
      } ${isDragSource ? "opacity-60" : ""} ${
        isDropTarget ? "ring-2 ring-indigo-400" : ""
      }`}
    >
      {/* Drag Handle */}
      <button
        ref={handleRef}
        type="button"
        aria-label={`Drag ${component.type} at position ${index + 1}`}
        title="Drag to reorder"
        className="touch-none cursor-grab rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Component Name */}
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 truncate text-left text-xs capitalize text-gray-200"
      >
        {index + 1}. {component.type}
      </button>

      {/* Move Up */}
      <button
        type="button"
        aria-label={`Move ${component.type} up`}
        title="Move up"
        onClick={() => onMove("up")}
        disabled={index === 0}
        className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
      >
        <ArrowUp className="size-3.5" />
      </button>

      {/* Move Down */}
      <button
        type="button"
        aria-label={`Move ${component.type} down`}
        title="Move down"
        onClick={() => onMove("down")}
        disabled={index === total - 1}
        className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
      >
        <ArrowDown className="size-3.5" />
      </button>

      {/* Delete */}
      <button
        type="button"
        aria-label={`Delete ${component.type}`}
        title="Delete component"
        onClick={onDelete}
        className="rounded p-1 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
