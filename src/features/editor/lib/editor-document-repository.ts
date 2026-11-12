import { openDB, type DBSchema } from "idb";

import type { EditorDocument } from "../types/editor-document";

interface CanvasFlowEditorDB extends DBSchema {
  documents: {
    key: string;
    value: EditorDocument;
  };
}

function getEditorDB() {
  return openDB<CanvasFlowEditorDB>("canvasflow-editor-documents", 1, {
    upgrade(db) {
      db.createObjectStore("documents", {
        keyPath: "projectId",
      });
    },
  });
}

// Load a saved document for one project.
export async function getEditorDocument(
  projectId: string,
): Promise<EditorDocument | null> {
  const db = await getEditorDB();

  const document = await db.get("documents", projectId);

  return document ?? null;
}

// Save or update a project's document.
export async function saveEditorDocument(
  document: EditorDocument,
): Promise<void> {
  const db = await getEditorDB();

  await db.put("documents", document);
}
