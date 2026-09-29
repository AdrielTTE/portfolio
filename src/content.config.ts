import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      scope: z.string(),
      stack: z.array(z.string()).min(1),
      year: z.number().int(),
      role: z.string(),
      team: z.string().optional(),
      repo: z.url().optional(),
      live: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      plate: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const lately = defineCollection({
  loader: file('./src/content/lately.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    text: z.string().max(140),
  }),
});

export const collections = { work, lately };
