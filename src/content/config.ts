import { defineCollection, z, reference } from 'astro:content';

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    subtitle: z.string(),
    description: z.string(),
    category: reference('categories'),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      weight: z.number().optional(), // Gravitational weight
    })).optional(),
    techStack: z.array(reference('tech')).optional(),
    link: z.string().optional(),
    inDevelopment: z.boolean().default(false),
  }),
});

const tech = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.enum(['frontend', 'backend', 'database', 'devops', 'ai', 'tool', 'general']),
  }),
});

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
  }),
});

export const collections = {
  projects,
  tech,
  categories,
};
