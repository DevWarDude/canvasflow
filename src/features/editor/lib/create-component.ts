import type {
  EditorComponent,
  EditorComponentType,
} from "../types/editor-document";

export function createEditorComponent(
  type: EditorComponentType,
): EditorComponent {
  const id = crypto.randomUUID();

  switch (type) {
    case "heading":
      return {
        id,
        type: "heading",
        props: {
          text: "New Heading",
          level: 1,
        },
        styles: {
          fontSize: 40,
          fontWeight: 700,
          color: "#111827",
          textAlign: "left",
        },
      };

    case "paragraph":
      return {
        id,
        type: "paragraph",
        props: {
          text: "Enter your paragraph text here.",
        },
        styles: {
          fontSize: 16,
          color: "#4B5563",
          textAlign: "left",
        },
      };

    case "button":
      return {
        id,
        type: "button",
        props: {
          label: "Click Me",
        },
        styles: {
          backgroundColor: "#635BFF",
          color: "#FFFFFF",
          padding: 12,
          borderRadius: 8,
        },
      };

    case "image":
      return {
        id,
        type: "image",
        props: {
          src: "",
          alt: "Image placeholder",
        },
        styles: {
          width: "100%",
          height: "240px",
          objectFit: "cover",
        },
      };

    case "section":
      return {
        id,
        type: "section",
        props: {
          label: "New Section",
        },
        styles: {
          backgroundColor: "#F8FAFC",
          padding: 32,
          width: "100%",
        },
      };
  }
}
