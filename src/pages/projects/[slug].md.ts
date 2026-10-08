import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const prerender = true;

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute = async (context) => {
  const { entry } = context.props as { entry: CollectionEntry<"projects"> };
  const site = context.site
    ? (context.site.href.endsWith("/") ? context.site.href : `${context.site.href}/`)
    : "https://einggraumfw.github.io/";

  const { data, id } = entry;
  const canonicalUrl = `${site}projects/${id}/`;
  const lastChecked = data.updated.toISOString().slice(0, 10);

  const lines: string[] = [
    `# ${data.title}`,
    "",
    `Status: ${data.status} (${data.statusNote}). Last checked ${lastChecked}.`,
    "",
    data.summary,
    "",
  ];

  if (data.repo) {
    lines.push(`Repository: ${data.repo}`);
  }
  if (data.release) {
    const releaseDate = data.release.date.toISOString().slice(0, 10);
    lines.push(`Release: ${data.release.tag} (${releaseDate}) ${data.release.url}`);
  }
  if (data.doi) {
    lines.push(`DOI: https://doi.org/${data.doi}`);
  }
  lines.push(`Canonical page: ${canonicalUrl}`);
  lines.push("");

  const body = (entry.body ?? "").replace(/^\r?\n+/, "");
  const fullText = lines.join("\n") + "\n" + body + (body.endsWith("\n") ? "" : "\n");

  return new Response(fullText, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
