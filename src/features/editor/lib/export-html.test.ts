import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateHtmlDocument } from "./export-html";
import { getImageAsset } from "./image-asset-repository";

import type { EditorComponent, EditorDocument } from "../types/editor-document";

// Replace IndexedDB access with a mock.
vi.mock("./image-asset-repository", () => ({
  getImageAsset: vi.fn(),
}));

const mockedGetImageAsset = vi.mocked(getImageAsset);

// Create test documents without repeating their structure.
function createTestDocument(components: EditorComponent[]): EditorDocument {
  return {
    schemaVersion: 1,
    projectId: "test-project",
    components,
  };
}

describe("CanvasFlow HTML Export", () => {
  beforeEach(() => {
    mockedGetImageAsset.mockReset();
  });

  it("generates a complete HTML document", async () => {
    const document = createTestDocument([]);

    const html = await generateHtmlDocument(document, "My Portfolio");

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("<title>My Portfolio</title>");
    expect(html).toContain("</html>");
  });

  it("preserves component order", async () => {
    const document = createTestDocument([
      {
        id: "heading-1",
        type: "heading",
        props: {
          text: "Welcome",
          level: 1,
        },
        styles: {},
      },
      {
        id: "paragraph-1",
        type: "paragraph",
        props: {
          text: "About my portfolio",
        },
        styles: {},
      },
    ]);

    const html = await generateHtmlDocument(document, "Portfolio");

    expect(html.indexOf("Welcome")).toBeLessThan(
      html.indexOf("About my portfolio"),
    );
  });

  it("escapes potentially unsafe HTML", async () => {
    const document = createTestDocument([
      {
        id: "heading-1",
        type: "heading",
        props: {
          text: '<script>alert("test")</script>',
          level: 1,
        },
        styles: {},
      },
    ]);

    const html = await generateHtmlDocument(document, "Safe Portfolio");

    expect(html).toContain("&lt;script&gt;");

    expect(html).not.toContain('<script>alert("test")</script>');
  });

  it("preserves component styling", async () => {
    const document = createTestDocument([
      {
        id: "heading-1",
        type: "heading",
        props: {
          text: "Styled Heading",
          level: 1,
        },
        styles: {
          fontSize: 48,
          color: "#7c3aed",
          textAlign: "center",
        },
      },
    ]);

    const html = await generateHtmlDocument(document, "Styled Portfolio");

    expect(html).toContain("<style>");
    expect(html).toContain("--cf-heading-size:48px");
    expect(html).toContain("color:#7c3aed");
    expect(html).toContain("text-align:center");
  });

  it("embeds uploaded images", async () => {
    const imageBlob = new Blob(["image-bytes"], {
      type: "image/png",
    });

    mockedGetImageAsset.mockResolvedValue({
      id: "image-1",
      blob: imageBlob,
      name: "photo.png",
      createdAt: Date.now(),
    });

    const document = createTestDocument([
      {
        id: "image-component-1",
        type: "image",
        props: {
          src: "asset:image-1",
          alt: "Portfolio photo",
        },
        styles: {},
      },
    ]);

    const html = await generateHtmlDocument(document, "Image Portfolio");

    expect(html).toContain("<img");
    expect(html).toContain("data:image/png;base64,");
    expect(html).toContain('alt="Portfolio photo"');
  });

  it("handles missing image assets", async () => {
    mockedGetImageAsset.mockResolvedValue(null);

    const document = createTestDocument([
      {
        id: "image-component-1",
        type: "image",
        props: {
          src: "asset:missing",
          alt: "Missing image",
        },
        styles: {},
      },
    ]);

    const html = await generateHtmlDocument(document, "Missing Image Test");

    expect(html).toContain("Image unavailable");

    expect(html).not.toContain('src="asset:missing"');
  });
});
