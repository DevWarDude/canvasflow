import type {
  EditorComponent,
  EditorDocument,
  EditorStyles,
} from "../types/editor-document";

// Convert special characters into safe HTML entities.
function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(
    /[&<>"']/g,
    (character) => entities[character] ?? character,
  );
}

// Accept only supported hexadecimal color values.
function isValidColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
    value,
  );
}

// Accept only simple, supported CSS dimensions.
function isValidDimension(value: string): boolean {
  return value === "auto" || /^\d+(?:\.\d+)?(?:px|%|rem|em|vw|vh)$/.test(value);
}

// Convert a valid number into a pixel value.
function toPixels(value: number | undefined): string | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 10000
  ) {
    return null;
  }

  return `${value}px`;
}

// Convert CanvasFlow component styles into safe CSS declarations.
function serializeStyles(
  styles: EditorStyles,
  type: EditorComponent["type"],
): string {
  const declarations: string[] = [];

  if (styles.color && isValidColor(styles.color)) {
    declarations.push(`color:${styles.color}`);
  }

  if (styles.backgroundColor && isValidColor(styles.backgroundColor)) {
    declarations.push(`background-color:${styles.backgroundColor}`);
  }

  const fontSize = toPixels(styles.fontSize);

  if (type === "heading") {
    // CSS controls responsive heading size.
    declarations.push(`--cf-heading-size:${fontSize ?? "32px"}`);
  } else if (fontSize) {
    declarations.push(`font-size:${fontSize}`);
  }

  if (
    typeof styles.fontWeight === "number" &&
    Number.isInteger(styles.fontWeight) &&
    styles.fontWeight >= 100 &&
    styles.fontWeight <= 900
  ) {
    declarations.push(`font-weight:${styles.fontWeight}`);
  }

  if (
    styles.textAlign === "left" ||
    styles.textAlign === "center" ||
    styles.textAlign === "right"
  ) {
    declarations.push(`text-align:${styles.textAlign}`);
  }

  if (styles.width && isValidDimension(styles.width)) {
    declarations.push(`width:${styles.width}`);
  }

  if (styles.height && isValidDimension(styles.height)) {
    declarations.push(`height:${styles.height}`);
  }

  const padding = toPixels(styles.padding);

  if (type === "section") {
    // CSS controls responsive section padding.
    declarations.push(`--cf-section-padding:${padding ?? "0px"}`);
  } else if (padding) {
    declarations.push(`padding:${padding}`);
  }

  const marginTop = toPixels(styles.marginTop);

  if (marginTop) {
    declarations.push(`margin-top:${marginTop}`);
  }

  const borderRadius = toPixels(styles.borderRadius);

  if (borderRadius) {
    declarations.push(`border-radius:${borderRadius}`);
  }

  if (styles.objectFit === "cover" || styles.objectFit === "contain") {
    declarations.push(`object-fit:${styles.objectFit}`);
  }

  return declarations.join(";");
}

// Create an HTML style attribute for one component.
function getStyleAttribute(component: EditorComponent): string {
  const css = serializeStyles(component.styles, component.type);

  return css ? ` style="${escapeHtml(css)}"` : "";
}

// Convert one component into HTML.
function renderComponent(component: EditorComponent): string {
  const styleAttribute = getStyleAttribute(component);

  switch (component.type) {
    case "heading": {
      const tag = `h${component.props.level}`;

      return `
        <${tag} class="cf-heading"${styleAttribute}>
          ${escapeHtml(component.props.text)}
        </${tag}>
      `;
    }

    case "paragraph":
      return `
        <p class="cf-paragraph"${styleAttribute}>
          ${escapeHtml(component.props.text)}
        </p>
      `;

    case "button":
      return `
        <button
          type="button"
          class="cf-button"
          ${styleAttribute}
        >
          ${escapeHtml(component.props.label)}
        </button>
      `;

    case "image":
      return `
        <div
          class="cf-image-placeholder"
          role="img"
          aria-label="${escapeHtml(component.props.alt || "Image placeholder")}"
          ${styleAttribute}
        >
          Image export is coming soon.
        </div>
      `;

    case "section":
      return `
        <section class="cf-section"${styleAttribute}>
          <p>${escapeHtml(component.props.label)}</p>
        </section>
      `;
  }
}

// Base styles for the exported website.
const BASE_CSS = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: #111827;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
  }

  h1, h2, h3, p {
    margin: 0;
  }

  .cf-page {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px;
    container-type: inline-size;
  }

  .cf-block {
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .cf-block + .cf-block {
    margin-top: 20px;
  }

  .cf-heading {
    max-width: 100%;
    font-size: var(--cf-heading-size, 32px);
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .cf-paragraph {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .cf-button {
    display: inline-block;
    max-width: 100%;
    border: 0;
    font: inherit;
    white-space: normal;
    overflow-wrap: anywhere;
    cursor: default;
  }

  .cf-section {
    max-width: 100%;
    min-width: 0;
    padding: var(--cf-section-padding, 0px);
    overflow-wrap: anywhere;
  }

  .cf-section > p {
    font-size: 14px;
    color: #6b7280;
  }

  .cf-image-placeholder {
    display: flex;
    max-width: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px dashed #d1d5db;
    background: #f9fafb;
    color: #9ca3af;
    text-align: center;
    font-size: 14px;
  }

  @container (max-width: 480px) {
    .cf-heading {
      font-size: min(var(--cf-heading-size, 32px), 8cqw);
    }

    .cf-section {
      padding: min(var(--cf-section-padding, 0px), 5cqw);
    }

    .cf-block + .cf-block {
      margin-top: 12px;
    }
  }

  @media (max-width: 480px) {
    .cf-page {
      padding: 16px;
    }
  }
`;

// Generate the complete standalone HTML document.
export function generateHtmlDocument(
  document: EditorDocument,
  projectName: string,
): string {
  const title = escapeHtml(projectName.trim() || "CanvasFlow Website");

  const pageContent = document.components
    .map(
      (component) => `
        <div class="cf-block">
          ${renderComponent(component)}
        </div>
      `,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>

  <style>
    ${BASE_CSS}
  </style>
</head>

<body>
  <main class="cf-page">
    ${pageContent}
  </main>
</body>
</html>`;
}
