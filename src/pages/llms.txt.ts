import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const site = context.site
    ? (context.site.href.endsWith("/") ? context.site.href : `${context.site.href}/`)
    : "https://einggraumfw.github.io/";

  const entries = await getCollection("projects");
  entries.sort((a, b) => a.data.order - b.data.order);

  const lines = [
    "# Faris Winawan",
    "",
    "> Ocean engineering graduate (ITB, Indonesia) doing independent research in wave energy. Research direction: field-data-informed hydrodynamics of self-reacting, weathervaning wave energy converters.",
    "",
    `Each project page states its status (Verified, In progress or Planned), what was checked and against what, and its open items. Structured data: ${site}projects.json`,
    "",
    "## Projects",
    "",
    ...entries.map(
      (entry) =>
        `- [${entry.data.title}](${site}projects/${entry.id}.md): ${entry.data.status}. ${entry.data.summary}`
    ),
    "",
    "## Optional",
    "",
    `- [About](${site}about/): background`,
    `- [Contact](${site}contact/): email, GitHub, LinkedIn`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
