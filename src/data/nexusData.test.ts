import { expect, test, describe } from 'bun:test';
import { nexusNodes, nexusLinks } from './nexusData';

describe('nexusData Integrity', () => {
  const nodeIds = new Set(nexusNodes.map(node => node.id));
  const nodeIdArray = Array.from(nodeIds);

  test('every link source must exist as a node id', () => {
    nexusLinks.forEach(link => {
      expect(nodeIdArray).toContain(link.source);
    });
  });

  test('every link target must exist as a node id', () => {
    nexusLinks.forEach(link => {
      expect(nodeIdArray).toContain(link.target);
    });
  });

  test('node ids must be unique', () => {
    const ids = nexusNodes.map(node => node.id);
    const uniqueIds = new Set();
    const duplicates: string[] = [];

    ids.forEach(id => {
      if (uniqueIds.has(id)) {
        duplicates.push(id);
      }
      uniqueIds.add(id);
    });

    expect(duplicates).toEqual([]);
  });

  test('no self-referencing links', () => {
    nexusLinks.forEach(link => {
      expect(link.source).not.toBe(link.target);
    });
  });
});
