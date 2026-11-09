import type { EditorComponent } from "../types/editor-document";

interface ComponentPreviewProps {
  component: EditorComponent;
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component.type) {
    case "heading":
      if (component.props.level === 1) {
        return <h1 style={component.styles}>{component.props.text}</h1>;
      }

      if (component.props.level === 2) {
        return <h2 style={component.styles}>{component.props.text}</h2>;
      }

      return <h3 style={component.styles}>{component.props.text}</h3>;

    case "paragraph":
      return <p style={component.styles}>{component.props.text}</p>;

    case "button":
      return (
        <span style={component.styles} className="inline-block">
          {component.props.label}
        </span>
      );

    case "image":
      return (
        <div
          style={component.styles}
          className="flex items-center justify-center border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400"
        >
          Image placeholder
        </div>
      );

    case "section":
      return (
        <section style={component.styles}>
          <p className="text-sm text-gray-500">{component.props.label}</p>
        </section>
      );
  }
}
