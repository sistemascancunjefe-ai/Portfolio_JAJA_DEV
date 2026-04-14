// @ts-nocheck
import { expect, test, describe } from 'bun:test';
import { nexusNodes, nexusLinks } from './nexusData';

describe('nexusData', () => {
  describe('Nodes', () => {
    test('should have exactly 33 nodes (22 real + 11 ghost)', () => {
      expect(nexusNodes.length).toBe(33);
    });

    test('should have unique IDs', () => {
      const ids = nexusNodes.map(n => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should contain the core node with correct properties', () => {
      const coreNode = nexusNodes.find(n => n.id === 'jaja_dev');
      expect(coreNode).toBeDefined();
      expect(coreNode?.category).toBe('core');
      expect(coreNode?.name).toBe('JAJA_DEV');
    });

    test('should contain exactly 11 ghost nodes with correct properties', () => {
      const ghostNodes = nexusNodes.filter(n => n.category === 'ghost');
      expect(ghostNodes.length).toBe(11);

      ghostNodes.forEach((node, index) => {
        expect(node.id).toBe(`ghost_${index}`);
        expect(node.inDevelopment).toBe(true);
        expect(node.subtitle).toBe('CLASSIFIED');
        expect(node.category).toBe('ghost');
      });
    });

    test('should contain all 6 category nodes', () => {
      const expectedCategories = [
        'cat_projects', 'cat_tech', 'cat_apps', 'cat_webs', 'cat_contrib', 'cat_media'
      ];
      expectedCategories.forEach(catId => {
        const node = nexusNodes.find(n => n.id === catId);
        expect(node).toBeDefined();
        expect(node?.category).toBe('category');
      });
    });

    test('should contain all 5 project nodes', () => {
      const expectedProjects = ['sac', 'validador', 'preventiva', 'sql_maestro', 'a2u'];
      expectedProjects.forEach(projId => {
        const node = nexusNodes.find(n => n.id === projId);
        expect(node).toBeDefined();
        expect(node?.category).toBe('project');
      });
    });
  });

  describe('Links', () => {
    test('should only have links with valid source and target IDs', () => {
      const nodeIds = new Set(nexusNodes.map(n => n.id));
      nexusLinks.forEach(link => {
        expect(nodeIds.has(link.source)).toBe(true);
        expect(nodeIds.has(link.target)).toBe(true);
      });
    });

    test('should connect core to all 6 categories', () => {
      const expectedCategories = [
        'cat_projects', 'cat_tech', 'cat_apps', 'cat_webs', 'cat_contrib', 'cat_media'
      ];
      expectedCategories.forEach(catId => {
        const link = nexusLinks.find(l => l.source === 'jaja_dev' && l.target === catId);
        expect(link).toBeDefined();
        expect(link?.value).toBe(2);
      });
    });

    test('should connect cat_projects to all 5 projects', () => {
      const expectedProjects = ['sac', 'validador', 'preventiva', 'sql_maestro', 'a2u'];
      expectedProjects.forEach(projId => {
        const link = nexusLinks.find(l => l.source === 'cat_projects' && l.target === projId);
        expect(link).toBeDefined();
        expect(link?.value).toBe(1);
      });
    });

    test('should connect core to all 11 ghost nodes', () => {
      const ghostNodes = nexusNodes.filter(n => n.category === 'ghost');
      ghostNodes.forEach(ghost => {
        const link = nexusLinks.find(l => l.source === 'jaja_dev' && l.target === ghost.id);
        expect(link).toBeDefined();
        expect(link?.value).toBe(0.5);
      });
    });

    test('should have the expected total number of links', () => {
      // 6 core->cat + 5 cat->proj + 4 sac->tech + 4 val->tech + 3 prev->tech + 2 sql->tech + 1 a2u->tech + 5 cat_tech->tech + 11 core->ghost
      // 6 + 5 + 4 + 4 + 3 + 2 + 1 + 5 + 11 = 41
      expect(nexusLinks.length).toBe(41);
    });
  });
});
