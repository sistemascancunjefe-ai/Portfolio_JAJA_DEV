import type { CollectionEntry } from 'astro:content';

export interface NexusNode {
  id: string;
  name: string;
  subtitle?: string;
  category: 'core' | 'project' | 'tech' | 'category' | 'ghost';
  description?: string;
  metrics?: { label: string; value: string; weight?: number }[];
  techStack?: string[];
  link?: string;
  inDevelopment?: boolean;
  mass: number;
}

export interface NexusLink {
  source: string;
  target: string;
  value: number;
}

export function transformNexusData(
  projects: CollectionEntry<'projects'>[] = [],
  tech: CollectionEntry<'tech'>[] = [],
  categories: CollectionEntry<'categories'>[] = []
) {
  // Defensive handling for null/undefined
  const safeProjects = projects || [];
  const safeTech = tech || [];
  const safeCategories = categories || [];

  const techById = new Map(safeTech.map(t => [t.id, t]));
  const nodes: NexusNode[] = [];
  const links: NexusLink[] = [];

  // Track created category IDs to prevent duplicates and manage defaults
  const createdCategoryIds = new Set<string>();

  // 1. Core Node
  nodes.push({
    id: 'jaja_dev',
    name: 'JAJA_DEV',
    subtitle: 'Core Ecosystem',
    category: 'core',
    description: 'The central nucleus of the Semantic Data Visualization Ecosystem. Gateway to professional identity and developer core.',
    mass: 150, // Base mass for core
  });

  // 2. Categories
  safeCategories.forEach(cat => {
    const nodeId = `cat_${cat.id}`;
    nodes.push({
      id: nodeId,
      name: cat.data.name,
      category: 'category',
      mass: 80,
    });
    createdCategoryIds.add(nodeId);
    // Connect categories to core
    links.push({ source: 'jaja_dev', target: nodeId, value: 2 });
  });

  // Ensure 'cat_tech' exists for technologies if not already present
  // This prevents orphaned tech nodes if 'tech' category is missing from input
  // Trigger only if there are actually technologies to show
  if (!createdCategoryIds.has('cat_tech') && safeTech.length > 0) {
      nodes.push({
          id: 'cat_tech',
          name: 'Technologies',
          category: 'category',
          mass: 80
      });
      createdCategoryIds.add('cat_tech');
      links.push({ source: 'jaja_dev', target: 'cat_tech', value: 2 });
  }

  // 3. Technologies
  safeTech.forEach(t => {
    nodes.push({
      id: `tech_${t.id}`,
      name: t.data.name,
      category: 'tech',
      mass: 40,
    });
    // Connect tech to its generic category
    links.push({ source: 'cat_tech', target: `tech_${t.id}`, value: 1 });
  });

  // 4. Projects
  safeProjects.forEach(p => {
    // Calculate mass based on metrics
    const baseMass = 60;
    const metricsWeight = p.data.metrics?.reduce((acc, m) => acc + (m.weight || 0), 0) || 0;
    const mass = baseMass + (metricsWeight / 10); // Adjust scaling as needed

    nodes.push({
      id: `project_${p.id}`,
      name: p.data.name,
      subtitle: p.data.subtitle,
      description: p.data.description,
      category: 'project',
      metrics: p.data.metrics,
      techStack: (p.data.techStack || []).map(ref => {
        const techId = typeof ref === 'string' ? ref : ref.id;
        return techById.get(techId)?.data.name || techId;
      }),
      inDevelopment: p.data.inDevelopment, link: p.data.link,
      mass: mass,
    });

    // Connect project to its category
    // Robust handling for missing categories
    const categoryId = typeof p.data.category === 'string'
      ? p.data.category
      : p.data.category?.id || 'uncategorized';

    const categoryNodeId = `cat_${categoryId}`;

    // If the category node doesn't exist (e.g., 'uncategorized' or a bad reference), create it
    if (!createdCategoryIds.has(categoryNodeId)) {
        nodes.push({
            id: categoryNodeId,
            name: categoryId === 'uncategorized' ? 'Uncategorized' : categoryId,
            category: 'category',
            mass: 80
        });
        createdCategoryIds.add(categoryNodeId);
        links.push({ source: 'jaja_dev', target: categoryNodeId, value: 2 });
    }

    links.push({ source: categoryNodeId, target: `project_${p.id}`, value: 2 });

    // Connect project to its technologies
    (p.data.techStack || []).forEach(tRef => {
      const techId = typeof tRef === 'string' ? tRef : tRef.id;
      links.push({ source: `project_${p.id}`, target: `tech_${techId}`, value: 1.5 });
    });
  });

  // 5. Ghost Nodes (1.5x Expansion Rule)
  // n real projects -> 0.5n ghost nodes
  // Used Math.ceil to ensure at least one ghost node exists if there are projects
  const ghostCount = safeProjects.length > 0 ? Math.ceil(safeProjects.length * 0.5) : 0;

  const ghostNames = [
    'Project X-RAY', 'Neural Engine', 'Quantum Bridge', 'Cyber Sentinel',
    'Data Vortex', 'Nexus Core v2', 'Shadow Protocol', 'Edge Intelligence'
  ];

  for (let i = 0; i < ghostCount; i++) {
    const targetProject = safeProjects[i % safeProjects.length];
    const ghostId = `ghost_${i}`;

    nodes.push({
      id: ghostId,
      name: ghostNames[i % ghostNames.length] || `Lab Project ${i}`,
      subtitle: 'CLASSIFIED',
      category: 'ghost',
      description: 'Under development in our clandestine innovation lab. Access restricted.',
      inDevelopment: true,
      mass: 30, // Ghost nodes are lighter
    });

    // Semantic link: connect to a real project as expansion module
    if (targetProject) {
        links.push({
            source: `project_${targetProject.id}`,
            target: ghostId,
            value: 1
        });
    }
  }

  return { nodes, links };
}
