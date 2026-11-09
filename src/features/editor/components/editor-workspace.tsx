import { LayoutTemplate } from "lucide-react";

export function EditorWorkspace() {
  return (
    <main className="flex min-w-0 flex-1 flex-col bg-canvas-workspace">

      {/* Workspace Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-6">
        <span className="text-xs font-medium text-gray-600">
          Canvas
        </span>

        <span className="text-xs text-gray-500">
          Desktop View
        </span>
      </div>

      {/* Workspace Content */}
      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-8">

        {/* Website Page */}
        <div className="min-h-[650px] w-full max-w-3xl self-start rounded-lg border border-gray-200 bg-white shadow-xl">

          {/* Empty Canvas */}
          <div className="flex min-h-[650px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#635BFF]/10">
              <LayoutTemplate className="size-8 text-[#635BFF]" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Your canvas is ready
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              Start building your website by adding
              components from the left sidebar.
            </p>

            <div className="mt-6 rounded-lg border border-dashed border-gray-300 px-5 py-3">
              <p className="text-xs text-gray-400">
                Your components will appear here.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}