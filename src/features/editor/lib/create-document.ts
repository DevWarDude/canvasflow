import type { EditorDocument } from "../types/editor-document";

export function createEmptyDocument(projectId: string): EditorDocument {
  return {
    schemaVersion: 1,
    projectId,
    components: [],
  };
}
