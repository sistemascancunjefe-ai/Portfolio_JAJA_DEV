import { expect, test, describe } from 'bun:test';
import { transformNexusData } from './nexusDataTransformer';

describe('nexusDataTransformer - Mass Calculation', () => {
  const mockCategories: any[] = [
    { id: 'web', data: { name: 'Web' } }
  ];

  const mockTech: any[] = [
    { id: 'react', data: { name: 'React', category: 'frontend' } }
  ];

  test('should have base mass of 60 when no metrics are provided', () => {
    const mockProjects: any[] = [
      {
        id: 'p1',
        data: {
          name: 'Project 1',
          subtitle: 'Sub 1',
          description: 'Desc 1',
          category: { id: 'web' },
          metrics: undefined
        }
      }
    ];

    const { nodes } = transformNexusData(mockProjects, mockTech, mockCategories);
    const projectNode = nodes.find(n => n.id === 'project_p1');
    expect(projectNode?.mass).toBe(60);
  });

  test('should have base mass of 60 when metrics are empty', () => {
    const mockProjects: any[] = [
      {
        id: 'p1_empty',
        data: {
          name: 'Project 1 Empty',
          subtitle: 'Sub 1',
          description: 'Desc 1',
          category: { id: 'web' },
          metrics: []
        }
      }
    ];

    const { nodes } = transformNexusData(mockProjects, mockTech, mockCategories);
    const projectNode = nodes.find(n => n.id === 'project_p1_empty');
    expect(projectNode?.mass).toBe(60);
  });

  test('should have base mass of 60 when metrics have no weights', () => {
    const mockProjects: any[] = [
      {
        id: 'p2',
        data: {
          name: 'Project 2',
          subtitle: 'Sub 2',
          description: 'Desc 2',
          category: { id: 'web' },
          metrics: [
            { label: 'Metric 1', value: 'Value 1' },
            { label: 'Metric 2', value: 'Value 2' }
          ]
        }
      }
    ];

    const { nodes } = transformNexusData(mockProjects, mockTech, mockCategories);
    const projectNode = nodes.find(n => n.id === 'project_p2');
    expect(projectNode?.mass).toBe(60);
  });

  test('should calculate mass correctly based on weights', () => {
    const mockProjects: any[] = [
      {
        id: 'p3',
        data: {
          name: 'Project 3',
          subtitle: 'Sub 3',
          description: 'Desc 3',
          category: { id: 'web' },
          metrics: [
            { label: 'Metric 1', value: '10', weight: 100 },
            { label: 'Metric 2', value: '20', weight: 50 }
          ]
        }
      }
    ];

    // baseMass (60) + (100 + 50) / 10 = 60 + 15 = 75
    const { nodes } = transformNexusData(mockProjects, mockTech, mockCategories);
    const projectNode = nodes.find(n => n.id === 'project_p3');
    expect(projectNode?.mass).toBe(75);
  });

  test('should handle mix of weighted and non-weighted metrics', () => {
    const mockProjects: any[] = [
      {
        id: 'p4',
        data: {
          name: 'Project 4',
          subtitle: 'Sub 4',
          description: 'Desc 4',
          category: { id: 'web' },
          metrics: [
            { label: 'Metric 1', value: '10', weight: 80 },
            { label: 'Metric 2', value: '20' }
          ]
        }
      }
    ];

    // baseMass (60) + (80 + 0) / 10 = 68
    const { nodes } = transformNexusData(mockProjects, mockTech, mockCategories);
    const projectNode = nodes.find(n => n.id === 'project_p4');
    expect(projectNode?.mass).toBe(68);
  });

  test('should handle multiple projects independently', () => {
    const mockProjects: any[] = [
      {
        id: 'p5a',
        data: {
          name: 'Project 5a',
          subtitle: 'Sub 5a',
          description: 'Desc 5a',
          category: { id: 'web' },
          metrics: [{ label: 'm1', value: 'v1', weight: 200 }]
        }
      },
      {
        id: 'p5b',
        data: {
          name: 'Project 5b',
          subtitle: 'Sub 5b',
          description: 'Desc 5b',
          category: { id: 'web' },
          metrics: [{ label: 'm1', value: 'v1', weight: 400 }]
        }
      }
    ];

    const { nodes } = transformNexusData(mockProjects, mockTech, mockCategories);

    const p5a = nodes.find(n => n.id === 'project_p5a');
    const p5b = nodes.find(n => n.id === 'project_p5b');

    expect(p5a?.mass).toBe(60 + 200/10); // 80
    expect(p5b?.mass).toBe(60 + 400/10); // 100
  });
});
