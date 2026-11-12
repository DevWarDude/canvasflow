"use client";

import { useEffect, useState } from "react";

import { getImageAsset } from "../lib/image-asset-repository";

import type { ImageComponent } from "../types/editor-document";

interface ImageComponentPreviewProps {
  component: ImageComponent;
}

export function ImageComponentPreview({
  component,
}: ImageComponentPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    null,
  );

  const [status, setStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  const source = component.props.src;

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    if (!source) {
      setImageUrl(null);
      setStatus("idle");
      return;
    }

    setImageUrl(null);
    setStatus("loading");

    getImageAsset(source)
      .then((asset) => {
        if (cancelled) return;

        if (!asset) {
          setStatus("error");
          return;
        }

        objectUrl = URL.createObjectURL(asset.blob);

        setImageUrl(objectUrl);
        setStatus("loaded");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [source]);

  if (status === "loaded" && imageUrl) {
    return (
      // Local Blob URLs do not need Next.js image optimization.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={component.props.alt}
        style={component.styles}
        className="block max-w-full"
      />
    );
  }

  return (
    <div
      style={component.styles}
      className="flex max-w-full min-w-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 text-center text-sm text-gray-400"
    >
      {status === "loading"
        ? "Loading image..."
        : status === "error"
          ? "Image could not be loaded"
          : "Upload an image from the Properties Panel"}
    </div>
  );
}