"use client";

import { useDroppable } from "@dnd-kit/react";

interface CanvasInsertionSlotProps {
  index: number;
}

export function CanvasInsertionSlot({ index }: CanvasInsertionSlotProps) {
  const { ref, isDropTarget } = useDroppable({
    id: `canvas-slot:${index}`,
    type: "canvas-slot",
    accept: "library-component",

    // Prefer this slot over the larger canvas
    // when both are underneath the dragged item.
    collisionPriority: 10,
  });

  return (
    <div ref={ref} aria-hidden="true" className="flex h-6 w-full items-center">
      <div
        className={`h-1 w-full rounded-full transition-colors ${
          isDropTarget ? "bg-indigo-500" : "bg-transparent"
        }`}
      />
    </div>
  );
}
