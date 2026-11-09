import {
  Type,
  AlignLeft,
  MousePointer2,
  ImageIcon,
  Square,
  Layers3,
} from "lucide-react";

const components = [
  {
    name: "Heading",
    icon: Type,
  },
  {
    name: "Paragraph",
    icon: AlignLeft,
  },
  {
    name: "Button",
    icon: MousePointer2,
  },
  {
    name: "Image",
    icon: ImageIcon,
  },
  {
    name: "Section",
    icon: Square,
  },
];

export function EditorSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-canvas-editor-border bg-canvas-editor-panel">

      {/* Component Library */}
      <section className="min-h-0 flex-1 overflow-y-auto p-4">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Components
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {components.map((component) => {
            const Icon = component.icon;

            return (
              <button
                key={component.name}
                type="button"
                disabled
                className="flex h-24 cursor-not-allowed flex-col items-center justify-center gap-3 rounded-xl border border-canvas-editor-border bg-white/5 text-gray-300 opacity-75"
              >
                <Icon className="size-5" />

                <span className="text-xs">
                  {component.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Layers */}
      <section className="flex h-64 shrink-0 flex-col border-t border-canvas-editor-border p-4">
        <div className="mb-5 flex items-center gap-2">
          <Layers3 className="size-4 text-gray-400" />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Layers
          </h2>
        </div>

        <div className="rounded-lg border border-canvas-editor-border bg-white/5 px-3 py-3">
          <p className="text-sm text-gray-200">
            Page
          </p>

          <p className="mt-2 text-xs text-gray-500">
            No components added yet.
          </p>
        </div>
      </section>
    </aside>
  );
}