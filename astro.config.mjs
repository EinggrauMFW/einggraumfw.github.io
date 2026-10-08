import { defineConfig } from "astro/config";

// Markdown tables come out without scope on header cells (WCAG H63); add it.
function rehypeThScope() {
  const walk = (node) => {
    if (node.type === "element" && node.tagName === "th") {
      node.properties = { ...node.properties, scope: "col" };
    }
    node.children?.forEach(walk);
  };
  return walk;
}

export default defineConfig({
  site: "https://einggraumfw.github.io",
  output: "static",
  build: {
    format: "directory",
  },
  markdown: {
    // Plain typed code blocks: no highlighter colours, no inline styles.
    syntaxHighlight: false,
    rehypePlugins: [rehypeThScope],
    remarkRehype: { footnoteLabel: "Sources" },
  },
});
