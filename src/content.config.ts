import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    status: z.enum(["Verified", "In progress", "Planned"]),
    statusNote: z.string(),
    summary: z.string(),
    updated: z.coerce.date(),
    order: z.number(),
    repo: z.string().url().optional(),
    sourcePublic: z.boolean().default(true),
    release: z
      .object({
        tag: z.string(),
        date: z.coerce.date(),
        url: z.string().url(),
      })
      .optional(),
    doi: z.string().optional(),
    languages: z.array(z.string()).default([]),
    licence: z.string().optional(),
    commit: z
      .object({
        sha: z.string(),
        url: z.string().url(),
      })
      .optional(),
    verification: z.array(z.string()).default([]),
    openItems: z.array(z.string()).default([]),
  }),
});

export const collections = { projects };
