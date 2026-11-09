"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import { useStore } from "zustand";

import {
  createEditorStore,
  type EditorStore,
} from "./editor-store";

type EditorStoreApi = ReturnType<typeof createEditorStore>;

const EditorStoreContext =
  createContext<EditorStoreApi | null>(null);

interface EditorStoreProviderProps {
  projectId: string;
  children: ReactNode;
}

export function EditorStoreProvider({
  projectId,
  children,
}: EditorStoreProviderProps) {
  const storeRef = useRef<EditorStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createEditorStore(projectId);
  }

  return (
    <EditorStoreContext.Provider value={storeRef.current}>
      {children}
    </EditorStoreContext.Provider>
  );
}

export function useEditorStore<T>(
  selector: (state: EditorStore) => T
): T {
  const store = useContext(EditorStoreContext);

  if (!store) {
    throw new Error(
      "useEditorStore must be used within EditorStoreProvider"
    );
  }

  return useStore(store, selector);
}