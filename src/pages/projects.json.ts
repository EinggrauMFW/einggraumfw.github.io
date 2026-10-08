import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const site = context.site
    ? (context.site.href.endsWith("/") ? context.site.href : `${context.site.href}/`)
    : "https://einggraumfw.github.io/";

  const entries = await getCollection("projects");
  entries.sort((a, b) => a.data.order - b.data.order);

  const projects = entries.map((entry) => {
    const { data, id } = entry;
    const commitSha =
      typeof data.commit === "string"
        ? data.commit
        : data.commit && typeof data.commit === "object"
          ? data.commit.sha
          : null;

    return {
      slug: id,
      title: data.title,
      status: data.status,
      statusNote: data.statusNote,
      summary: data.summary,
      url: `${site}projects/${id}/`,
      markdown: `${site}projects/${id}.md`,
      repo: data.repo ?? null,
      sourcePublic: data.sourcePublic ?? true,
      release: data.release
        ? {
            tag: data.release.tag,
            date: data.release.date.toISOString().slice(0, 10),
            url: data.release.url,
          }
        : null,
      doi: data.doi ?? null,
      commit: commitSha,
      languages: data.languages ?? [],
      licence: data.licence ?? null,
      verification: data.verification ?? [],
      openItems: data.openItems ?? [],
      lastVerified: data.updated.toISOString().slice(0, 10),
    };
  });

  const payload = {
    site,
    author: "Faris Winawan",
    generated: new Date().toISOString().slice(0, 10),
    projects,
  };

  return new Response(JSON.stringify(payload, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
