// @ts-ignore
import { describe, expect, test } from 'bun:test';
import { transformNexusData } from './nexusDataTransformer';
import type { CollectionEntry } from 'astro:content';

describe('nexusDataTransformer - Link Mapping', () => {
  test('should map link field from project data', () => {
    const projects = [{
      id: 'test_project',
      slug: 'test-project',
      body: '',
      collection: 'projects',
      data: {
        name: 'Test Project',
        subtitle: 'Test Subtitle',
        description: 'Test Description',
        category: { id: 'projects' },
        link: 'https://example.com',
        metrics: [],
        techStack: [],
        inDevelopment: false
      }
    }] as unknown as CollectionEntry<'projects'>[];

    const tech = [] as unknown as CollectionEntry<'tech'>[];
    const categories = [{
      id: 'projects',
      slug: 'projects',
      body: '',
      collection: 'categories',
      data: { name: 'Projects' }
    }] as unknown as CollectionEntry<'categories'>[];

    const { nodes } = transformNexusData(projects, tech, categories);
    const projectNode = nodes.find(n => n.id === 'project_test_project');

    expect(projectNode).toBeDefined();
    expect(projectNode?.link).toBe('https://example.com');
  });
});
