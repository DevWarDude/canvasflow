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
  document: EditorDocument;
  selectedComponentId: string | null;
  isDirty: boolean;

  addComponent: (type: EditorComponentType) => void;
  selectComponent: (id: string | null) => void;
  removeComponent: (id: string) => void;

  updateComponentText: (id: string, text: string) => void;
  updateComponentStyle: (
    id: string,
    styles: Partial<EditorStyles>
  ) => void;
}

// Update the correct text property for each component.
function changeComponentText(
  component: EditorComponent,
  text: string
): EditorComponent {
  switch (component.type) {
    case "heading":
    case "paragraph":
      return {
        ...component,
        props: {
          ...component.props,
          text,
        },
      };

    case "button":
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

export function createEditorStore(projectId: string) {
  return createStore<EditorStore>()((set) => ({
    document: createEmptyDocument(projectId),
    selectedComponentId: null,
    isDirty: false,

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

    // Update heading text, paragraph text, or button/section label.
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

    // Update only the specified style properties.
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
  }));
}