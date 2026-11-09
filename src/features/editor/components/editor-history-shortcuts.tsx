"use client";

import { useEffect } from "react";

import { useEditorStore } from "../store/editor-store-provider";

export function EditorHistoryShortcuts() {
  const undo = useEditorStore(
    (state) => state.undo
  );

  const redo = useEditorStore(
    (state) => state.redo
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey
      ) {
        return;
      }

      const isModifierPressed =
        event.ctrlKey || event.metaKey;

      if (!isModifierPressed) {
        return;
      }

      const target = event.target;

      // Let editable controls handle native text undo.
      if (
        target instanceof Element &&
        target.closest(
          "input, textarea, select, [contenteditable], [role='textbox']"
        )
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      if (
        (key === "z" && event.shiftKey) ||
        (key === "y" && !event.shiftKey)
      ) {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [undo, redo]);

  return null;
}