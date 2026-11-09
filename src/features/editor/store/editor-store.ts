import { createStore } from "zustand/vanilla";

import { createEditorComponent } from "../lib/create-component";
import { createEmptyDocument } from "../lib/create-document";

import type {
  EditorComponent,
  EditorComponentType,
  EditorDocument,
  EditorStyles,
} from "../types/editor-document";

export interface EditorStore {
  // State
  document: EditorDocument;
  selectedComponentId: string | null;
  isDirty: boolean;

  // Component actions
  addComponent: (type: EditorComponentType) => void;
  selectComponent: (id: string | null) => void;
  removeComponent: (id: string) => void;

  // Editing actions
  updateComponentText: (id: string, text: string) => void;

  updateComponentStyle: (
    id: string,
    styles: Partial<EditorStyles>
  ) => void;

  // Persistence action
  markSaved: (savedDocument: EditorDocument) => void;
}

// Update the appropriate text property.
function changeComponentText(
  component: EditorComponent,
  text: string
): EditorComponent {
  switch (component.type) {
    case "heading":
      return {
        ...component,
        props: {
          ...component.props,
          text,
        },
      };

    case "paragraph":
      return {
        ...component,
        props: {
          ...component.props,
          text,
        },
      };

    case "button":
      return {
        ...component,
        props: {
          ...component.props,
          label: text,
        },
      };

    case "section":
      return {
        ...component,
        props: {
          ...component.props,
          label: text,
        },
      };

    case "image":
      return component;
  }
}

// Create a separate editor store for each project.
export function createEditorStore(
  projectId: string,
  initialDocument?: EditorDocument | null
) {
  return createStore<EditorStore>()((set) => ({
    // Initial state
    document:
      initialDocument ?? createEmptyDocument(projectId),

    selectedComponentId: null,
    isDirty: false,

    // Add component
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

    // Select component
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

    // Remove component
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

    // Update component text
    updateComponentText: (id, text) => {
      set((state) => {
        const target = state.document.components.find(
          (component) => component.id === id
        );

        if (!target || target.type === "image") {
          return state;
        }

        return {
          document: {
            ...state.document,

            components: state.document.components.map(
              (component) =>
                component.id === id
                  ? changeComponentText(component, text)
                  : component
            ),
          },

          isDirty: true,
        };
      });
    },

    // Update component styles
    updateComponentStyle: (id, styles) => {
      set((state) => {
        const exists = state.document.components.some(
          (component) => component.id === id
        );

        if (!exists) {
          return state;
        }

        return {
          document: {
            ...state.document,

            components: state.document.components.map(
              (component) =>
                component.id === id
                  ? {
                      ...component,

                      styles: {
                        ...component.styles,
                        ...styles,
                      },
                    }
                  : component
            ),
          },

          isDirty: true,
        };
      });
    },

    // Mark the document as saved
    markSaved: (savedDocument) => {
      set((state) => {
        // Don't clear unsaved changes if the user
        // has edited the document since saving started.
        if (state.document !== savedDocument) {
          return state;
        }

        return {
          isDirty: false,
        };
      });
    },
  }));
}