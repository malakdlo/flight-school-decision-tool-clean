import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const journey = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journey' }),
  schema: z.object({
    title: z.string(),
    flightNumber: z.number().optional(),
    date: z.date(),
    stage: z.enum(['pre-flight-school', 'ppl']),
    hoursThisFlight: z.number().optional(),
    totalHours: z.number().optional(),
    aircraft: z.string().optional(),
    airport: z.string().optional(),
    summary: z.string(),
    lesson: z.string().optional(),
    relatedTool: z.object({ label: z.string(), href: z.string() }).optional(),
    draft: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    href: z.string(),
    category: z.string(),
    categoryClasses: z.string(),
    audience: z.enum(['researching', 'ppl-student', 'both']),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { journey, guides };
