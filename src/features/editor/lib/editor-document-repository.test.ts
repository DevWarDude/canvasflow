// @vitest-environment node

import "fake-indexeddb/auto";

import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";

import { createEmptyDocument } from "./create-document";

import {
  getEditorDocument,
  saveEditorDocument,
} from "./editor-document-repository";

import type { EditorDocument } from "../types/editor-document";

describe("CanvasFlow Document Persistence", () => {
  beforeEach(() => {
    // Give every test a fresh in-memory database.
    globalThis.indexedDB = new IDBFactory();
  });

  it("returns null when a project has no saved document", async () => {
    const document = await getEditorDocument("missing-project");

    expect(document).toBeNull();
  });

  it("saves and retrieves an editor document", async () => {
    const document = createEmptyDocument("project-1");

    await saveEditorDocument(document);

    const savedDocument = await getEditorDocument("project-1");

    expect(savedDocument).toEqual(document);
  });

  it("updates an existing document", async () => {
    const original = createEmptyDocument("project-1");

    await saveEditorDocument(original);

    const updated: EditorDocument = {
      ...original,

      components: [
        {
          id: "heading-1",
          type: "heading",
          props: {
            text: "Welcome to CanvasFlow",
            level: 1,
          },
          styles: {
            color: "#7c3aed",
            fontSize: 48,
          },
        },
      ],
    };

    await saveEditorDocument(updated);

    const savedDocument = await getEditorDocument("project-1");

    expect(savedDocument).toEqual(updated);
    expect(savedDocument?.components).toHaveLength(1);
  });

  it("keeps different projects independent", async () => {
    const firstProject = createEmptyDocument("project-1");

    const secondProject = createEmptyDocument("project-2");

    await saveEditorDocument(firstProject);
    await saveEditorDocument(secondProject);

    const savedFirst = await getEditorDocument("project-1");
    const savedSecond = await getEditorDocument("project-2");

    expect(savedFirst?.projectId).toBe("project-1");
    expect(savedSecond?.projectId).toBe("project-2");
  });
});
