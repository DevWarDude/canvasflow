"use client";

import { SlidersHorizontal } from "lucide-react";

import { useEditorStore } from "../store/editor-store-provider";

import type {
  EditorComponent,
} from "../types/editor-document";

// Return editable text for supported components.
function getComponentText(
  component: EditorComponent
): string | null {
  switch (component.type) {
    case "heading":
    case "paragraph":
      return component.props.text;

    case "button":
    case "section":
      return component.props.label;

    case "image":
      return null;
  }
}

export function PropertiesPanel() {
  const selectedComponent = useEditorStore((state) =>
    state.document.components.find(
      (component) =>
        component.id === state.selectedComponentId
    )
  );

  const updateComponentText = useEditorStore(
    (state) => state.updateComponentText
  );

  const updateComponentStyle = useEditorStore(
    (state) => state.updateComponentStyle
  );

  const textValue = selectedComponent
    ? getComponentText(selectedComponent)
    : null;

  const supportsTypography =
    selectedComponent?.type === "heading" ||
    selectedComponent?.type === "paragraph" ||
    selectedComponent?.type === "button";

  const supportsBackground =
    selectedComponent?.type === "button" ||
    selectedComponent?.type === "section";

  const supportsAlignment =
    selectedComponent?.type === "heading" ||
    selectedComponent?.type === "paragraph";

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-canvas-editor-border bg-canvas-editor-panel">
      {/* Header */}
      <div className="flex h-14 items-center gap-3 border-b border-canvas-editor-border px-5">
        <SlidersHorizontal className="size-4 text-gray-400" />

        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Properties
        </h2>
      </div>

      {!selectedComponent ? (
        <div className="px-6 py-16 text-center">
          <h3 className="text-sm font-medium text-white">
            Nothing selected
          </h3>

          <p className="mt-3 text-xs leading-5 text-gray-400">
            Select a component to edit its properties.
          </p>
        </div>
      ) : (
        <div className="space-y-6 p-5">
          {/* Component information */}
          <div className="border-b border-canvas-editor-border pb-5">
            <p className="text-xs text-gray-400">
              Selected Component
            </p>

            <h3 className="mt-2 text-sm font-semibold capitalize text-white">
              {selectedComponent.type}
            </h3>
          </div>

          {/* Content editor */}
          {textValue !== null && (
            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Content
              </h4>

              <label
                htmlFor="component-content"
                className="block text-xs text-gray-300"
              >
                Text
              </label>

              <textarea
                id="component-content"
                value={textValue}
                onChange={(event) =>
                  updateComponentText(
                    selectedComponent.id,
                    event.target.value
                  )
                }
                rows={4}
                className="w-full resize-y rounded-lg border border-canvas-editor-border bg-white/5 p-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </section>
          )}

          {/* Typography */}
          {supportsTypography && (
            <section className="space-y-4 border-t border-canvas-editor-border pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Typography
              </h4>

              {/* Font Size */}
              <div className="space-y-2">
                <label
                  htmlFor="component-font-size"
                  className="block text-xs text-gray-300"
                >
                  Font Size (px)
                </label>

                <input
                  id="component-font-size"
                  type="number"
                  min={1}
                  max={150}
                  value={
                    selectedComponent.styles.fontSize ?? 16
                  }
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value === "") return;

                    const fontSize = Number(value);

                    if (
                      Number.isFinite(fontSize) &&
                      fontSize >= 1 &&
                      fontSize <= 150
                    ) {
                      updateComponentStyle(
                        selectedComponent.id,
                        { fontSize }
                      );
                    }
                  }}
                  className="h-10 w-full rounded-lg border border-canvas-editor-border bg-white/5 px-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <label
                  htmlFor="component-text-color"
                  className="block text-xs text-gray-300"
                >
                  Text Color
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="component-text-color"
                    type="color"
                    value={
                      selectedComponent.styles.color ??
                      (selectedComponent.type === "button"
                        ? "#ffffff"
                        : "#111827")
                    }
                    onChange={(event) =>
                      updateComponentStyle(
                        selectedComponent.id,
                        {
                          color: event.target.value,
                        }
                      )
                    }
                    className="h-10 w-12 cursor-pointer rounded border border-canvas-editor-border bg-transparent"
                  />

                  <span className="text-xs text-gray-300">
                    {selectedComponent.styles.color ??
                      "Default"}
                  </span>
                </div>
              </div>

              {/* Text Alignment */}
              {supportsAlignment && (
                <div className="space-y-2">
                  <label
                    htmlFor="component-text-align"
                    className="block text-xs text-gray-300"
                  >
                    Text Alignment
                  </label>

                  <select
                    id="component-text-align"
                    value={
                      selectedComponent.styles.textAlign ??
                      "left"
                    }
                    onChange={(event) =>
                      updateComponentStyle(
                        selectedComponent.id,
                        {
                          textAlign: event.target.value as
                            | "left"
                            | "center"
                            | "right",
                        }
                      )
                    }
                    className="h-10 w-full rounded-lg border border-canvas-editor-border bg-[#25252d] px-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              )}
            </section>
          )}

          {/* Background Color */}
          {supportsBackground && (
            <section className="space-y-3 border-t border-canvas-editor-border pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Appearance
              </h4>

              <label
                htmlFor="component-background"
                className="block text-xs text-gray-300"
              >
                Background Color
              </label>

              <input
                id="component-background"
                type="color"
                value={
                  selectedComponent.styles.backgroundColor ??
                  (selectedComponent.type === "button"
                    ? "#635BFF"
                    : "#F8FAFC")
                }
                onChange={(event) =>
                  updateComponentStyle(
                    selectedComponent.id,
                    {
                      backgroundColor: event.target.value,
                    }
                  )
                }
                className="h-10 w-12 cursor-pointer rounded border border-canvas-editor-border bg-transparent"
              />
            </section>
          )}

          {selectedComponent.type === "image" && (
            <p className="text-xs leading-5 text-gray-400">
              Image source and upload controls will be
              implemented in a later milestone.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}