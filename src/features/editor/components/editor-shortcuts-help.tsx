"use client";

import { Keyboard } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Available editor shortcuts
const shortcuts = [
  {
    action: "Undo",
    keys: "Ctrl / Cmd + Z",
  },
  {
    action: "Redo",
    keys: "Ctrl / Cmd + Shift + Z",
  },
  {
    action: "Redo (alternative)",
    keys: "Ctrl / Cmd + Y",
  },
  {
    action: "Duplicate component",
    keys: "Ctrl / Cmd + D",
  },
  {
    action: "Delete component",
    keys: "Delete",
  },
  {
    action: "Delete (alternative)",
    keys: "Backspace",
  },
] as const;

export function EditorShortcutsHelp() {
  return (
    <Dialog>
      {/* Button that opens the dialog */}
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          />
        }
      >
        <Keyboard className="size-4" />
        Shortcuts
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>

          <DialogDescription>
            Use these shortcuts to work faster in CanvasFlow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.action}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-3 py-3"
            >
              <span className="text-sm text-foreground">{shortcut.action}</span>

              <kbd className="shrink-0 rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Select a component before using Duplicate or Delete. Shortcuts are
          ignored while typing inside text inputs.
        </p>
      </DialogContent>
    </Dialog>
  );
}
