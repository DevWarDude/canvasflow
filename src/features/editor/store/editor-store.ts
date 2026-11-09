import { createStore } from "zustand/vanilla";

import { createEditorComponent } from "../lib/create-component";
import { createEmptyDocument } from "../lib/create-document";

import type {
  EditorComponent,
  EditorComponentType,
  EditorDocument,
  EditorStyles,
} from "../types/editor-document";

const HISTORY_LIMIT = 50;
const GROUP_WINDOW_MS = 750;

interface EditMeta {
  kind: "text" | "style";
  componentId: string;
  field: string;
}

interface LastEdit extends EditMeta {
  timestamp: number;
}

export interface EditorStore {
  // Current document
  document: EditorDocument;
  savedDocument: EditorDocument;

  // Editor state
  selectedComponentId: string | null;
  isDirty: boolean;

  // History
  past: EditorDocument[];
  future: EditorDocument[];
  lastEdit: LastEdit | null;

  // Component actions
  addComponent: (type: EditorComponentType) => void;
  selectComponent: (id: string | null) => void;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, direction: "up" | "down") => void;

  // Editing actions
  updateComponentText: (id: string, text: string) => void;

  updateComponentStyle: (id: string, styles: Partial<EditorStyles>) => void;

  // History actions
  undo: () => void;
  redo: () => void;

  // Persistence actions
  beginSave: () => void;
  markSaved: (savedDocument: EditorDocument) => void;
}

type HistoryUpdate = Pick<
  EditorStore,
  "document" | "past" | "future" | "isDirty" | "lastEdit"
>;

// Record a document change in our history.
function recordDocumentChange(
  state: EditorStore,
  nextDocument: EditorDocument,
  edit: EditMeta | null = null,
): HistoryUpdate {
  const now = Date.now();

  // Group rapid changes to the same field.
  const shouldGroup =
    edit !== null &&
    state.lastEdit !== null &&
    state.past.length > 0 &&
    state.future.length === 0 &&
    state.lastEdit.kind === edit.kind &&
    state.lastEdit.componentId === edit.componentId &&
    state.lastEdit.field === edit.field &&
    now - state.lastEdit.timestamp < GROUP_WINDOW_MS;

  return {
    document: nextDocument,

    past: shouldGroup
      ? state.past
      : [...state.past, state.document].slice(-HISTORY_LIMIT),

    // A new edit invalidates the redo history.
    future: [],

    isDirty: nextDocument !== state.savedDocument,

    lastEdit: edit ? { ...edit, timestamp: now } : null,
  };
}

// Update text while preserving each component's type.
function changeComponentText(
  component: EditorComponent,
  text: string,
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

export function createEditorStore(
  projectId: string,
  initialDocument?: EditorDocument | null,
) {
  // Use one shared reference for the current and saved
  // document when initializing the editor.
  const initial = initialDocument ?? createEmptyDocument(projectId);

  return createStore<EditorStore>()((set) => ({
    document: initial,
    savedDocument: initial,

    selectedComponentId: null,
    isDirty: false,

    past: [],
    future: [],
    lastEdit: null,

    // ADD COMPONENT
    addComponent: (type) => {
      const newComponent = createEditorComponent(type);

      set((state) => {
        const nextDocument: EditorDocument = {
          ...state.document,
          components: [...state.document.components, newComponent],
        };

        return {
          ...recordDocumentChange(state, nextDocument),
          selectedComponentId: newComponent.id,
        };
      });
    },

    // SELECT COMPONENT
    selectComponent: (id) => {
      set((state) => {
        const exists =
          id === null ||
          state.document.components.some((component) => component.id === id);

        return {
          selectedComponentId: exists ? id : null,
          lastEdit: null,
        };
      });
    },

    // REMOVE COMPONENT
    removeComponent: (id) => {
      set((state) => {
        const exists = state.document.components.some(
          (component) => component.id === id,
        );

        if (!exists) return state;

        const nextDocument: EditorDocument = {
          ...state.document,
          components: state.document.components.filter(
            (component) => component.id !== id,
          ),
        };

        return {
          ...recordDocumentChange(state, nextDocument),

          selectedComponentId:
            state.selectedComponentId === id ? null : state.selectedComponentId,
        };
      });
    },

    // UPDATE TEXT
    updateComponentText: (id, text) => {
      set((state) => {
        const target = state.document.components.find(
          (component) => component.id === id,
        );

        if (!target || target.type === "image") {
          return state;
        }

        const currentText =
          target.type === "heading" || target.type === "paragraph"
            ? target.props.text
            : target.props.label;

        if (currentText === text) {
          return state;
        }

        const nextDocument: EditorDocument = {
          ...state.document,
          components: state.document.components.map((component) =>
            component.id === id
              ? changeComponentText(component, text)
              : component,
          ),
        };

        return recordDocumentChange(state, nextDocument, {
          kind: "text",
          componentId: id,
          field: "content",
        });
      });
    },

    // UPDATE STYLES
    updateComponentStyle: (id, styles) => {
      set((state) => {
        const target = state.document.components.find(
          (component) => component.id === id,
        );

        if (!target) return state;

        const keys = Object.keys(styles) as (keyof EditorStyles)[];

        if (
          keys.length === 0 ||
          keys.every((key) => target.styles[key] === styles[key])
        ) {
          return state;
        }

        const nextDocument: EditorDocument = {
          ...state.document,
          components: state.document.components.map((component) =>
            component.id === id
              ? {
                  ...component,
                  styles: {
                    ...component.styles,
                    ...styles,
                  },
                }
              : component,
          ),
        };

        return recordDocumentChange(state, nextDocument, {
          kind: "style",
          componentId: id,
          field: keys.sort().join(","),
        });
      });
    },

    // UNDO
    undo: () => {
      set((state) => {
        if (state.past.length === 0) {
          return state;
        }

        const previous = state.past[state.past.length - 1];

        return {
          document: previous,

          past: state.past.slice(0, -1),

          future: [...state.future, state.document].slice(-HISTORY_LIMIT),

          isDirty: previous !== state.savedDocument,

          selectedComponentId:
            state.selectedComponentId &&
            previous.components.some(
              (component) => component.id === state.selectedComponentId,
            )
              ? state.selectedComponentId
              : null,

          lastEdit: null,
        };
      });
    },

    // REDO
    redo: () => {
      set((state) => {
        if (state.future.length === 0) {
          return state;
        }

        const next = state.future[state.future.length - 1];

        return {
          document: next,

          past: [...state.past, state.document].slice(-HISTORY_LIMIT),

          future: state.future.slice(0, -1),

          isDirty: next !== state.savedDocument,

          selectedComponentId:
            state.selectedComponentId &&
            next.components.some(
              (component) => component.id === state.selectedComponentId,
            )
              ? state.selectedComponentId
              : null,

          lastEdit: null,
        };
      });
    },

    // Create a history boundary when saving starts.
    beginSave: () => {
      set({
        lastEdit: null,
      });
    },

    // UPDATE SAVED DOCUMENT
    markSaved: (savedDocument) => {
      set((state) => ({
        savedDocument,

        // New edits made during saving remain unsaved.
        isDirty: state.document !== savedDocument,

        lastEdit: null,
      }));
    },

    // MOVE COMPONENT
    moveComponent: (id, direction) => {
      set((state) => {
        const components = state.document.components;

        // Find the component's current position.
        const currentIndex = components.findIndex(
          (component) => component.id === id,
        );

        // Component doesn't exist.
        if (currentIndex === -1) {
          return state;
        }

        // Calculate its destination.
        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        // Prevent moving beyond array boundaries.
        if (targetIndex < 0 || targetIndex >= components.length) {
          return state;
        }

        // Create a new array.
        const reorderedComponents = [...components];

        // Remove the component from its old position.
        const [movedComponent] = reorderedComponents.splice(currentIndex, 1);

        if (!movedComponent) {
          return state;
        }

        // Insert it at its new position.
        reorderedComponents.splice(targetIndex, 0, movedComponent);

        // Create a new document.
        const nextDocument: EditorDocument = {
          ...state.document,
          components: reorderedComponents,
        };

        // Record the change for Undo/Redo.
        return recordDocumentChange(state, nextDocument);
      });
    },
  }));
}
