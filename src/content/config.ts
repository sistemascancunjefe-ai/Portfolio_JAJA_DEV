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

const philosophy = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    content: z.string(),
    principles: z.array(z.string()).optional(),
  }),
});

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    bio: z.string(),
    skills: z.array(z.string()).optional(),
  }),
});

const homelab = defineCollection({
  type: 'data',
  schema: z.object({
    component: z.string(),
    model: z.string(),
    specs: z.string(),
    purpose: z.string(),
  }),
});

export const collections = {
  projects,
  tech,
  categories,
  philosophy,
  profile,
  homelab,
};
