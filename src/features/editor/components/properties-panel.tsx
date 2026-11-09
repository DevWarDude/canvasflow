import { SlidersHorizontal } from "lucide-react";

export function PropertiesPanel() {
  return (
    <aside className="w-72 shrink-0 border-l border-canvas-editor-border bg-canvas-editor-panel">

      {/* Header */}
      <div className="flex h-14 items-center gap-3 border-b border-canvas-editor-border px-5">
        <SlidersHorizontal className="size-4 text-gray-400" />

        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Properties
        </h2>
      </div>

      {/* Empty Selection State */}
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

        <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-white/5">
          <SlidersHorizontal className="size-6 text-gray-400" />
        </div>

        <h3 className="text-sm font-medium text-white">
          Nothing selected
        </h3>

        <p className="mt-3 text-xs leading-5 text-gray-400">
          Select a component on the canvas
          to customize its properties.
        </p>

      </div>
    </aside>
  );
}