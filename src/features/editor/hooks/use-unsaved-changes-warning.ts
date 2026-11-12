"use client";

import { useEffect } from "react";

export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    // No unsaved changes? No warning needed.
    if (!hasUnsavedChanges) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      // Ask the browser to warn the user.
      event.preventDefault();

      // Legacy fallback for browsers that require it.
      event.returnValue = true;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the listener when no longer needed.
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
}
