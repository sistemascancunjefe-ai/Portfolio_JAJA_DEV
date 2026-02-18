import { expect, test, describe } from 'bun:test';
import { transformNexusData } from './nexusDataTransformer';

// Helper to create mock data
const createMockProject = (id: string, overrides: any = {}) => ({
  id,
  data: {
    name: `Project ${id}`,
    subtitle: 'Subtitle',
    description: 'Description',
    category: { id: 'web' },
    metrics: [],
    techStack: [],
    inDevelopment: false,
    ...overrides
  }
});

const createMockTech = (id: string, overrides: any = {}) => ({
  id,
  data: {
    name: `Tech ${id}`,
    ...overrides
  }
});

const createMockCategory = (id: string, overrides: any = {}) => ({
  id,
  data: {
    name: `Category ${id}`,
    ...overrides
  }
});

describe('nexusDataTransformer', () => {

  describe('Structure', () => {
    test('should always include the Core Node (jaja_dev)', () => {
      const { nodes } = transformNexusData([], [], []);
      const coreNode = nodes.find(n => n.id === 'jaja_dev');
      expect(coreNode).toBeDefined();
      expect(coreNode?.category).toBe('core');
    });

    test('should create nodes for provided categories and link to core', () => {
      const categories: any[] = [createMockCategory('web'), createMockCategory('mobile')];
      const { nodes, links } = transformNexusData([], [], categories);

      expect(nodes.find(n => n.id === 'cat_web')).toBeDefined();
      expect(nodes.find(n => n.id === 'cat_mobile')).toBeDefined();

      const webLink = links.find(l => l.source === 'jaja_dev' && l.target === 'cat_web');
      expect(webLink).toBeDefined();
    });

    test('should create nodes for technologies and link to tech category', () => {
      const tech: any[] = [createMockTech('react'), createMockTech('bun')];
      const { nodes, links } = transformNexusData([], tech, []);

      expect(nodes.find(n => n.id === 'tech_react')).toBeDefined();
      expect(nodes.find(n => n.id === 'tech_bun')).toBeDefined();
      expect(nodes.find(n => n.id === 'cat_tech')).toBeDefined(); // Implicitly created

      const reactLink = links.find(l => l.source === 'cat_tech' && l.target === 'tech_react');
      expect(reactLink).toBeDefined();
    });
  });

  describe('Physics/Mass', () => {
    const categories: any[] = [createMockCategory('web')];

    test('should have base mass of 60 when no metrics are provided', () => {
      const projects: any[] = [createMockProject('p1', { metrics: undefined })];
      const { nodes } = transformNexusData(projects, [], categories);
      expect(nodes.find(n => n.id === 'project_p1')?.mass).toBe(60);
    });

    test('should calculate mass correctly based on weights', () => {
      const projects: any[] = [createMockProject('p2', {
        metrics: [{ weight: 100 }, { weight: 50 }]
      })];
      // 60 + (150 / 10) = 75
      const { nodes } = transformNexusData(projects, [], categories);
      expect(nodes.find(n => n.id === 'project_p2')?.mass).toBe(75);
    });
  });

  describe('Ghost Logic', () => {
    test('should create 0 ghost nodes when there are 0 projects', () => {
      const { nodes } = transformNexusData([], [], []);
      const ghostNodes = nodes.filter(n => n.category === 'ghost');
      expect(ghostNodes.length).toBe(0);
    });

    test('should create 1 ghost node when there is 1 project (Math.ceil rule)', () => {
      const projects: any[] = [createMockProject('p1')];
      const { nodes, links } = transformNexusData(projects, [], []);
      const ghostNodes = nodes.filter(n => n.category === 'ghost');

      expect(ghostNodes.length).toBe(1);

      // Verify link to project
      const ghostId = ghostNodes[0].id;
      const link = links.find(l => l.source === 'project_p1' && l.target === ghostId);
      expect(link).toBeDefined();
    });

    test('should generate unique IDs for ghost nodes', () => {
      const projects: any[] = Array.from({ length: 10 }, (_, i) => createMockProject(`p${i}`));
      // 10 projects -> 5 ghosts
      const { nodes } = transformNexusData(projects, [], []);
      const ghostNodes = nodes.filter(n => n.category === 'ghost');

      expect(ghostNodes.length).toBe(5);
      const ids = new Set(ghostNodes.map(n => n.id));
      expect(ids.size).toBe(5);
    });
  });

  describe('Resilience', () => {
    test('should handle orphaned technologies (missing tech category input)', () => {
      // Tech category is NOT passed in categories array
      const tech: any[] = [createMockTech('orphan_tech')];
      const { nodes, links } = transformNexusData([], tech, []);

      // 'cat_tech' should be auto-generated
      expect(nodes.find(n => n.id === 'cat_tech')).toBeDefined();
      expect(links.find(l => l.source === 'jaja_dev' && l.target === 'cat_tech')).toBeDefined();
      expect(links.find(l => l.source === 'cat_tech' && l.target === 'tech_orphan_tech')).toBeDefined();
    });

    test('should handle project with missing category', () => {
      const projects: any[] = [createMockProject('p_no_cat', { category: undefined })];
      const { nodes, links } = transformNexusData(projects, [], []);

      // Should default to 'uncategorized'
      const uncategorizedNode = nodes.find(n => n.id === 'cat_uncategorized');
      expect(uncategorizedNode).toBeDefined();
      expect(uncategorizedNode?.name).toBe('Uncategorized');

      // Link check
      expect(links.find(l => l.source === 'cat_uncategorized' && l.target === 'project_p_no_cat')).toBeDefined();
    });

    test('should handle project with null category id', () => {
       const projects: any[] = [createMockProject('p_null_cat', { category: { id: null } })];
       // Code: if (p.data.category && p.data.category.id) -> checks truthiness.
       // So null id -> uncategorized.
       const { nodes } = transformNexusData(projects, [], []);
       expect(nodes.find(n => n.id === 'cat_uncategorized')).toBeDefined();
    });
  });
});
