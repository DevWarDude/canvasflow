// @vitest-environment node

import "fake-indexeddb/auto";

import { IDBFactory } from "fake-indexeddb";

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CanvasFlow Image Persistence", () => {
  beforeEach(() => {
    // Give every test fresh IndexedDB storage.
    globalThis.indexedDB = new IDBFactory();

    // Reset the repository's cached database connection.
    vi.resetModules();
  });

  it("saves and retrieves an uploaded image", async () => {
    const { saveImageAsset, getImageAsset } =
      await import("./image-asset-repository");

    const file = new File(["test-image-content"], "portfolio.png", {
      type: "image/png",
    });

    const source = await saveImageAsset(file);

    expect(source).toMatch(/^asset:/);

    const savedImage = await getImageAsset(source);

    expect(savedImage).not.toBeNull();

    expect(savedImage?.name).toBe("portfolio.png");

    expect(savedImage?.blob.type).toBe("image/png");

    expect(savedImage?.blob.size).toBe(file.size);
  });

  it("rejects unsupported file types", async () => {
    const { saveImageAsset } = await import("./image-asset-repository");

    const file = new File(["not-an-image"], "document.txt", {
      type: "text/plain",
    });

    await expect(saveImageAsset(file)).rejects.toThrow();
  });

  it("rejects empty image files", async () => {
    const { saveImageAsset } = await import("./image-asset-repository");

    const file = new File([], "empty.png", {
      type: "image/png",
    });

    await expect(saveImageAsset(file)).rejects.toThrow();
  });

  it("rejects images larger than 5 MB", async () => {
    const { saveImageAsset } = await import("./image-asset-repository");

    const oversizedContent = new Uint8Array(5 * 1024 * 1024 + 1);

    const file = new File([oversizedContent], "large.png", {
      type: "image/png",
    });

    await expect(saveImageAsset(file)).rejects.toThrow();
  });

  it("handles missing and invalid image references", async () => {
    const { getImageAsset } = await import("./image-asset-repository");

    expect(await getImageAsset("")).toBeNull();

    expect(await getImageAsset("invalid-source")).toBeNull();

    expect(await getImageAsset("asset:missing")).toBeNull();
  });
});
