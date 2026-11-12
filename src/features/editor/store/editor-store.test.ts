// @vitest-environment node

import { describe, expect, it } from "vitest";

import { createEditorStore } from "./editor-store";

describe("CanvasFlow Editor Store", () => {
  // TEST 1 — INITIAL STATE

  it("initializes with an empty document", () => {
    const store = createEditorStore("test-project");

    const state = store.getState();

    expect(state.document.projectId).toBe("test-project");

    expect(state.document.components).toHaveLength(0);

    expect(state.selectedComponentId).toBeNull();

    expect(state.isDirty).toBe(false);

    expect(state.past).toHaveLength(0);

    expect(state.future).toHaveLength(0);
  });

  // TEST 2 — ADD COMPONENT

  it("adds a component and marks the document as dirty", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("heading");

    const state = store.getState();

    expect(state.document.components).toHaveLength(1);

    expect(state.document.components[0].type).toBe("heading");

    expect(state.isDirty).toBe(true);

    expect(state.selectedComponentId).toBe(state.document.components[0].id);
  });

  // TEST 3 — IMMUTABLE STYLE UPDATES

  it("updates component styles without mutating the original", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("button");

    const original = store.getState().document.components[0];

    store.getState().updateComponentStyle(original.id, {
      backgroundColor: "#000000",
    });

    const updated = store.getState().document.components[0];

    expect(updated.styles.backgroundColor).toBe("#000000");

    expect(original.styles.backgroundColor).not.toBe("#000000");

    expect(updated.styles).not.toBe(original.styles);
  });

  // TEST 4 — DUPLICATE COMPONENT

  it("duplicates a component with a new ID", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("heading");

    const originalId = store.getState().document.components[0].id;

    store.getState().duplicateComponent(originalId);

    const state = store.getState();

    const [original, duplicate] = state.document.components;

    expect(state.document.components).toHaveLength(2);

    expect(duplicate.id).not.toBe(original.id);

    expect(duplicate.type).toBe(original.type);

    expect(duplicate.props).toEqual(original.props);

    expect(duplicate.styles).toEqual(original.styles);

    expect(duplicate.props).not.toBe(original.props);

    expect(state.selectedComponentId).toBe(duplicate.id);
  });

  // TEST 5 — UNDO AND REDO

  it("supports Undo and Redo", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("heading");

    store.getState().addComponent("paragraph");

    expect(store.getState().document.components).toHaveLength(2);

    store.getState().undo();

    expect(store.getState().document.components).toHaveLength(1);

    store.getState().redo();

    expect(store.getState().document.components).toHaveLength(2);
  });

  // TEST 6 — DELETE AND UNDO

  it("removes a component and can restore it", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("heading");

    const componentId = store.getState().document.components[0].id;

    store.getState().removeComponent(componentId);

    expect(store.getState().document.components).toHaveLength(0);

    store.getState().undo();

    expect(store.getState().document.components).toHaveLength(1);

    expect(store.getState().document.components[0].id).toBe(componentId);
  });

  // TEST 7 — SAVE STATE

  it("clears the dirty state after saving", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("heading");

    expect(store.getState().isDirty).toBe(true);

    const documentToSave = store.getState().document;

    store.getState().beginSave();

    store.getState().markSaved(documentToSave);

    expect(store.getState().isDirty).toBe(false);

    const componentId = documentToSave.components[0].id;

    store.getState().updateComponentText(componentId, "Updated after saving");

    expect(store.getState().isDirty).toBe(true);
  });

  // TEST 8 — REDO HISTORY

  it("clears Redo history after a new change", () => {
    const store = createEditorStore("test-project");

    store.getState().addComponent("heading");

    store.getState().addComponent("paragraph");

    store.getState().undo();

    expect(store.getState().future).toHaveLength(1);

    // A new edit creates a different history branch.
    store.getState().addComponent("button");

    expect(store.getState().future).toHaveLength(0);

    const types = store
      .getState()
      .document.components.map((component) => component.type);

    expect(types).toEqual(["heading", "button"]);
  });
});
