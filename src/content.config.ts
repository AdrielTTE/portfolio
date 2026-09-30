import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const node = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: z.string(), note: z.string() });

const diagram = z
  .object({ nodes: z.array(node).min(2), edges: z.array(z.tuple([z.string(), z.string()])) })
  .superRefine((d, ctx) => {
    const ids = new Set(d.nodes.map((n) => n.id));
    d.edges.forEach(([from, to], i) => {
      for (const id of [from, to]) {
        if (!ids.has(id)) ctx.addIssue({ code: 'custom', path: ['edges', i], message: `Unknown diagram node id "${id}"` });
      }
    });
  });

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Page <title> and meta description; fall back to `${title}: Adriel Tang` and `summary`.
      seoTitle: z.string().max(60).optional(),
      seoDescription: z.string().max(160).optional(),
      summary: z.string().max(160),
      scope: z.string(),
      stack: z.array(z.string()).min(1),
      year: z.number().int(),
      role: z.string(),
      team: z.string().optional(),
      repo: z.url().optional(),
      live: z.url().optional(),
      offers: z.array(z.enum(['websites', 'webapps', 'mobile'])).default([]),
      device: z.enum(['phone', 'browser']).default('browser'),
      shots: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      diagram: diagram.optional(),
      schema: z.array(z.object({ table: z.string(), fields: z.array(z.string()).min(1) })).optional(),
      problem: z.string().optional(),
      decision: z.string().optional(),
      change: z.string().optional(),
      forYou: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const lately = defineCollection({
  loader: file('./src/content/lately.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    type: z.enum(['feat', 'fix', 'ship', 'learn', 'life']),
    text: z.string().max(140),
  }),
});

export const collections = { work, lately };
