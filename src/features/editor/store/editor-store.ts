import { createStore } from "zustand/vanilla";

import { createEditorComponent } from "../lib/create-component";
import { createEmptyDocument } from "../lib/create-document";

import type {
  EditorComponentType,
  EditorDocument,
} from "../types/editor-document";

export interface EditorStore {
  // State
  document: EditorDocument;
  selectedComponentId: string | null;
  isDirty: boolean;

  // Actions
  addComponent: (type: EditorComponentType) => void;
  selectComponent: (id: string | null) => void;
  removeComponent: (id: string) => void;
}

export function createEditorStore(projectId: string) {
  return createStore<EditorStore>()((set) => ({
    // Initial state
    document: createEmptyDocument(projectId),
    selectedComponentId: null,
    isDirty: false,

    // Add a component
    addComponent: (type) => {
      const newComponent = createEditorComponent(type);

      set((state) => ({
        document: {
          ...state.document,
          components: [
            ...state.document.components,
            newComponent,
          ],
        },

        selectedComponentId: newComponent.id,
        isDirty: true,
      }));
    },

    // Select a component
    selectComponent: (id) => {
      set((state) => {
        const exists =
          id === null ||
          state.document.components.some(
            (component) => component.id === id
          );

        return {
          selectedComponentId: exists ? id : null,
        };
      });
    },

    // Remove a component
    removeComponent: (id) => {
      set((state) => ({
        document: {
          ...state.document,
          components: state.document.components.filter(
            (component) => component.id !== id
          ),
        },

        selectedComponentId:
          state.selectedComponentId === id
            ? null
            : state.selectedComponentId,

        isDirty: true,
      }));
    },
  }));
}