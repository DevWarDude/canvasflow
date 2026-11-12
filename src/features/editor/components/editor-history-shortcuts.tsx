"use client";

import { useEffect } from "react";

import { useEditorStore } from "../store/editor-store-provider";

export function EditorHistoryShortcuts() {
  // ZUSTAND ACTIONS

  const undo = useEditorStore((state) => state.undo);

  const redo = useEditorStore((state) => state.redo);

  const duplicateComponent = useEditorStore(
    (state) => state.duplicateComponent,
  );

  const removeComponent = useEditorStore((state) => state.removeComponent);

  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  // KEYBOARD SHORTCUTS

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ignore already handled or composing events.
      if (event.defaultPrevented || event.isComposing || event.altKey) {
        return;
      }

      const target = event.target;

      // Ignore shortcuts while a dialog is active.
      if (target instanceof Element && target.closest("[role='dialog']")) {
        return;
      }

      // Don't interfere with text inputs.
      const isEditingText =
        target instanceof Element &&
        target.closest(
          "input, textarea, select, [contenteditable], [role='textbox']",
        );

      if (isEditingText) {
        return;
      }

      const key = event.key.toLowerCase();

      const isModifierPressed = event.ctrlKey || event.metaKey;

      // CTRL / CMD SHORTCUTS

      if (isModifierPressed) {
        // UNDO: Ctrl + Z
        if (key === "z" && !event.shiftKey) {
          event.preventDefault();
          undo();
          return;
        }

        // REDO: Ctrl + Shift + Z or Ctrl + Y
        if (
          (key === "z" && event.shiftKey) ||
          (key === "y" && !event.shiftKey)
        ) {
          event.preventDefault();
          redo();
          return;
        }

        // DUPLICATE: Ctrl + D
        if (
          key === "d" &&
          !event.shiftKey &&
          !event.repeat &&
          selectedComponentId
        ) {
          event.preventDefault();

          duplicateComponent(selectedComponentId);

          return;
        }

        return;
      }

      // DELETE SELECTED COMPONENT

      if (
        selectedComponentId &&
        !event.shiftKey &&
        !event.repeat &&
        (key === "delete" || key === "backspace")
      ) {
        // Avoid deleting components while operating
        // toolbar buttons, links or dialogs.
        if (
          target instanceof Element &&
          target.closest("button, a, [role='dialog'], [role='menu']")
        ) {
          return;
        }

        event.preventDefault();

        removeComponent(selectedComponentId);
      }
    }

    // Register the keyboard listener.
    window.addEventListener("keydown", handleKeyDown);

    // Remove the listener when the effect cleans up.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, duplicateComponent, removeComponent, selectedComponentId]);

  return null;
}
