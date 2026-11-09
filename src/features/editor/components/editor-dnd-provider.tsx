"use client";

import type { ReactNode } from "react";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import { useEditorStore } from "../store/editor-store-provider";

import type { EditorComponentType } from "../types/editor-document";

interface EditorDndProviderProps {
  children: ReactNode;
}

function isEditorComponentType(value: unknown): value is EditorComponentType {
  return (
    value === "heading" ||
    value === "paragraph" ||
    value === "button" ||
    value === "image" ||
    value === "section"
  );
}

export function EditorDndProvider({ children }: EditorDndProviderProps) {
  const addComponent = useEditorStore((state) => state.addComponent);

  const reorderComponent = useEditorStore((state) => state.reorderComponent);

  const insertComponentAt = useEditorStore((state) => state.insertComponentAt);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) {
          return;
        }

        const { source, target } = event.operation;

        if (!source) {
          return;
        }

        // CASE 1: Component dragged from the library
        // CASE 1: Dragging from the component library
        if (source.type === "library-component") {
          const componentType: unknown = source.data?.componentType;

          if (!isEditorComponentType(componentType)) {
            return;
          }

          // Dropped on an insertion slot.
          if (
            typeof target?.id === "string" &&
            target.id.startsWith("canvas-slot:")
          ) {
            const index = Number(target.id.slice("canvas-slot:".length));

            if (Number.isInteger(index)) {
              insertComponentAt(componentType, index);
            }

            return;
          }

          // Dropped elsewhere on the white canvas:
          if (target?.id === "editor-canvas") {
            addComponent(componentType);
          }

          return;
        }
        // CASE 2: Reordering existing components
        if (isSortable(source)) {
          // Accept sortable operations from our two editor groups.
          const isEditorSortable =
            source.type === "layer-component" ||
            source.type === "canvas-component";

          if (!isEditorSortable) {
            return;
          }

          const { initialIndex, index, initialGroup, group } = source;

          // Don't move components between sortable groups.
          if (initialGroup !== group) {
            return;
          }

          // Nothing changed.
          if (initialIndex === index) {
            return;
          }

          // Both the Layers panel and canvas use
          // the same document array.
          reorderComponent(initialIndex, index);
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
}
