import type { CSSProperties } from "react";

import type { EditorComponent } from "../types/editor-document";
import { ImageComponentPreview } from "./image-component-preview";

interface ComponentPreviewProps {
  component: EditorComponent;
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component.type) {
    // HEADING

    case "heading": {
      const headingStyles: CSSProperties & {
        "--cf-heading-size": string;
      } = {
        ...component.styles,

        fontSize: undefined,

        "--cf-heading-size": `${component.styles.fontSize ?? 32}px`,
      };

      const headingClassName =
        "max-w-full [overflow-wrap:anywhere] [font-size:var(--cf-heading-size)] @max-[480px]/canvas:[font-size:min(var(--cf-heading-size),8cqw)]";

      if (component.props.level === 1) {
        return (
          <h1 style={headingStyles} className={headingClassName}>
            {component.props.text}
          </h1>
        );
      }

      if (component.props.level === 2) {
        return (
          <h2 style={headingStyles} className={headingClassName}>
            {component.props.text}
          </h2>
        );
      }

      return (
        <h3 style={headingStyles} className={headingClassName}>
          {component.props.text}
        </h3>
      );
    }

    // PARAGRAPH

    case "paragraph":
      return (
        <p
          style={component.styles}
          className="max-w-full [overflow-wrap:anywhere]"
        >
          {component.props.text}
        </p>
      );

    // BUTTON

    case "button":
      return (
        <span
          style={component.styles}
          className="inline-block max-w-full whitespace-normal [overflow-wrap:anywhere]"
        >
          {component.props.label}
        </span>
      );

    // IMAGE PLACEHOLDER

    case "image":
  return <ImageComponentPreview component={component} />;

    // SECTION

    case "section": {
      const sectionStyles: CSSProperties & {
        "--cf-section-padding": string;
      } = {
        ...component.styles,

        padding: undefined,

        "--cf-section-padding": `${component.styles.padding ?? 0}px`,
      };

      return (
        <section
          style={sectionStyles}
          className="max-w-full min-w-0 [overflow-wrap:anywhere] [padding:var(--cf-section-padding)] @max-[480px]/canvas:[padding:min(var(--cf-section-padding),5cqw)]"
        >
          <p className="text-sm text-gray-500">{component.props.label}</p>
        </section>
      );
    }
  }
}
