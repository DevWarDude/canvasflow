import type { EditorComponent, EditorDocument } from "../types/editor-document";

// Escape special characters before inserting text into HTML.
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

// Convert one CanvasFlow component into an HTML string.
function renderComponent(component: EditorComponent): string {
  switch (component.type) {
    case "heading": {
      const tag =
        component.props.level === 1
          ? "h1"
          : component.props.level === 2
            ? "h2"
            : "h3";

      return `<${tag} class="cf-heading">${escapeHtml(component.props.text)}</${tag}>`;
    }

    case "paragraph":
      return `<p class="cf-paragraph">${escapeHtml(component.props.text)}</p>`;

    case "button":
      return `<button type="button" class="cf-button">${escapeHtml(component.props.label)}</button>`;

    case "image":
      return `
        <div
          class="cf-image-placeholder"
          role="img"
          aria-label="${escapeHtml(component.props.alt || "Image placeholder")}"
        >
          Image export is coming soon.
        </div>
      `;

    case "section":
      return `
        <section class="cf-section">
          <p>${escapeHtml(component.props.label)}</p>
        </section>
      `;
  }
}

// Convert the entire editor document into an HTML page.
export function generateHtmlDocument(
  document: EditorDocument,
  projectName: string,
): string {
  const title = escapeHtml(projectName.trim() || "CanvasFlow Website");

  const pageContent = document.components
    .map((component) => renderComponent(component))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body>
  <main class="cf-page">
    ${pageContent}
  </main>
</body>
</html>`;
}
