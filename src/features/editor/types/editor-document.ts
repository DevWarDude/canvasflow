// The five component types supported in our MVP
export type EditorComponentType =
  | "heading"
  | "paragraph"
  | "button"
  | "image"
  | "section";

// Shared styling properties
export interface EditorStyles {
  color?: string;
  backgroundColor?: string;

  fontSize?: number;
  fontWeight?: number;

  textAlign?: "left" | "center" | "right";

  width?: string;
  height?: string;

  padding?: number;
  marginTop?: number;

  borderRadius?: number;
  objectFit?: "cover" | "contain";
}

// Common structure for editor components
interface BaseEditorComponent<
  T extends EditorComponentType,
  P
> {
  id: string;
  type: T;
  props: P;
  styles: EditorStyles;
}

// Heading
export type HeadingComponent = BaseEditorComponent<
  "heading",
  {
    text: string;
    level: 1 | 2 | 3;
  }
>;

// Paragraph
export type ParagraphComponent = BaseEditorComponent<
  "paragraph",
  {
    text: string;
  }
>;

// Button
export type ButtonComponent = BaseEditorComponent<
  "button",
  {
    label: string;
  }
>;

// Image
export type ImageComponent = BaseEditorComponent<
  "image",
  {
    src: string;
    alt: string;
  }
>;

// Section
export type SectionComponent = BaseEditorComponent<
  "section",
  {
    label: string;
  }
>;

// Union of all supported components
export type EditorComponent =
  | HeadingComponent
  | ParagraphComponent
  | ButtonComponent
  | ImageComponent
  | SectionComponent;

// Complete editor document
export interface EditorDocument {
  schemaVersion: 1;
  projectId: string;
  components: EditorComponent[];
}