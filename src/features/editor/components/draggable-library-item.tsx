"use client";

import {
  GripVertical,
  type LucideIcon,
} from "lucide-react";

import { useDraggable } from "@dnd-kit/react";

import type {
  EditorComponentType,
} from "../types/editor-document";

interface DraggableLibraryItemProps {
  name: string;
  type: EditorComponentType;
  icon: LucideIcon;
  onAdd: (type: EditorComponentType) => void;
}

export function DraggableLibraryItem({
  name,
  type,
  icon: Icon,
  onAdd,
}: DraggableLibraryItemProps) {
  const {
    ref,
    handleRef,
    isDragSource,
  } = useDraggable({
    id: `library:${type}`,
    type: "library-component",
    data: {
      componentType: type,
    },
  });

  return (
    <div
      ref={ref}
      className={`relative rounded-xl border border-canvas-editor-border bg-white/5 transition-colors hover:border-indigo-500 hover:bg-white/10 ${
        isDragSource ? "opacity-50" : ""
      }`}
    >
      {/* Click to add */}
      <button
        type="button"
        onClick={() => onAdd(type)}
        className="flex h-24 w-full flex-col items-center justify-center gap-3 text-gray-300"
      >
        <Icon className="size-5" />

        <span className="text-xs">
          {name}
        </span>
      </button>

      {/* Drag to canvas */}
      <button
        ref={handleRef}
        type="button"
        title="Drag onto canvas"
        aria-label={`Drag ${name} onto canvas`}
        className="absolute right-1 top-1 touch-none cursor-grab rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white active:cursor-grabbing"
      >
        <GripVertical className="size-3.5" />
      </button>
    </div>
  );
}