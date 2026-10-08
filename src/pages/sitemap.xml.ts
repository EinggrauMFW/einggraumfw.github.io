import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const site = context.site
    ? (context.site.href.endsWith("/") ? context.site.href : `${context.site.href}/`)
    : "https://einggraumfw.github.io/";

  const projects = await getCollection("projects");
  projects.sort((a, b) => a.data.order - b.data.order);

  const staticUrls = [site, `${site}about/`, `${site}contact/`];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls.map((url) => `  <url><loc>${url}</loc></url>`),
    ...projects.map(
      (p) =>
        `  <url><loc>${site}projects/${p.id}/</loc><lastmod>${p.data.updated.toISOString().slice(0, 10)}</lastmod></url>`
    ),
    "</urlset>",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
