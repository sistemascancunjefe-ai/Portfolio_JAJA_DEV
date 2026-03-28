import { expect, test, describe } from 'bun:test';
import { generateGhostNodes } from './nexusData.ts';

describe('generateGhostNodes helper', () => {
  test('should return an empty array if realCount is 0', () => {
    const nodes = generateGhostNodes(0);
    expect(nodes).toEqual([]);
    expect(nodes.length).toBe(0);
  });

  test('should return an empty array if realCount is 1 (Math.floor(1 * 0.5) is 0)', () => {
    const nodes = generateGhostNodes(1);
    expect(nodes).toEqual([]);
    expect(nodes.length).toBe(0);
  });

  test('should return 1 node if realCount is 2 (Math.floor(2 * 0.5) is 1)', () => {
    const nodes = generateGhostNodes(2);
    expect(nodes.length).toBe(1);
    expect(nodes[0].id).toBe('ghost_0');
    expect(nodes[0].category).toBe('ghost');
  });

  test('should return 5 nodes if realCount is 10', () => {
    const nodes = generateGhostNodes(10);
    expect(nodes.length).toBe(5);

    // Verify unique IDs and pattern
    for (let i = 0; i < 5; i++) {
      expect(nodes[i].id).toBe(`ghost_${i}`);
    }
  });

  test('should verify generated node properties', () => {
    const nodes = generateGhostNodes(2);
    const node = nodes[0];

    expect(node.category).toBe('ghost');
    expect(node.subtitle).toBe('CLASSIFIED');
    expect(node.inDevelopment).toBe(true);
    expect(node.description).toBe('Under development in our clandestine innovation lab. Access restricted.');
  });

  test('should cycle names from the predefined list correctly', () => {
    // The names list has 13 entries (Project X-RAY to Prism OS)
    // To see cycling, we need realCount > 13 * 2 = 26. Let's use 30 (15 ghosts).
    const nodes = generateGhostNodes(30);
    expect(nodes.length).toBe(15);

    // Check first few names
    expect(nodes[0].name).toBe('Project X-RAY');
    expect(nodes[1].name).toBe('Neural Engine');

    // Check cycle (index 13 should be 'Project X-RAY' again)
    // names[13 % 13] -> names[0]
    expect(nodes[13].name).toBe('Project X-RAY');
    expect(nodes[14].name).toBe('Neural Engine');
  });
});
