"use client";

import { useState } from "react";

import { saveImageAsset } from "../lib/image-asset-repository";
import { useEditorStore } from "../store/editor-store-provider";

import type { ImageComponent } from "../types/editor-document";

interface ImagePropertiesPanelProps {
  component: ImageComponent;
}

export function ImagePropertiesPanel({ component }: ImagePropertiesPanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const updateImageProps = useEditorStore((state) => state.updateImageProps);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const source = await saveImageAsset(file);

      updateImageProps(component.id, {
        src: source,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to upload image.",
      );
    } finally {
      setIsUploading(false);
      input.value = "";
    }
  }

  return (
    <section className="space-y-4 border-t border-canvas-editor-border pt-5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Image
      </h4>

      {/* Upload image */}
      <div className="space-y-2">
        <label
          htmlFor="component-image-upload"
          className="block text-xs text-gray-300"
        >
          Upload Image
        </label>

        <input
          id="component-image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={isUploading}
          onChange={handleUpload}
          className="block w-full text-xs text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white disabled:opacity-50"
        />

        <p className="text-xs text-gray-500">JPG, PNG or WebP. Maximum 5 MB.</p>

        {isUploading && (
          <p role="status" className="text-xs text-indigo-400">
            Uploading image...
          </p>
        )}

        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Alt text */}
      <div className="space-y-2">
        <label
          htmlFor="component-image-alt"
          className="block text-xs text-gray-300"
        >
          Alternative Text
        </label>

        <input
          id="component-image-alt"
          type="text"
          value={component.props.alt}
          onChange={(event) =>
            updateImageProps(component.id, {
              alt: event.target.value,
            })
          }
          placeholder="Describe the image"
          className="h-10 w-full rounded-lg border border-canvas-editor-border bg-white/5 px-3 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>

      {/* Remove image */}
      {component.props.src && (
        <button
          type="button"
          onClick={() =>
            updateImageProps(component.id, {
              src: "",
            })
          }
          disabled={isUploading}
          className="rounded-md border border-red-500/30 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
        >
          Remove Image
        </button>
      )}
    </section>
  );
}
