import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const events = defineCollection({
  loader: file('src/data/events.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    image: z.string(),
    description: z.string(),
    tagline: z.string(),
    helloasso: z.string().url(),
    extra_intro: z.string().optional(),
    extra_text: z.string().optional(),
    extra_image_url: z.string().url().optional(),
    extra_image_alt: z.string().optional(),
  }),
});

const partners = defineCollection({
  loader: file('src/data/partners.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    description: z.string(),
    url: z.string().url(),
  }),
});

export const collections = { events, partners };
