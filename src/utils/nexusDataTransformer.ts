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
  projects: CollectionEntry<'projects'>[],
  tech: CollectionEntry<'tech'>[],
  categories: CollectionEntry<'categories'>[]
) {
  const nodes: NexusNode[] = [];
  const links: NexusLink[] = [];

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
  categories.forEach(cat => {
    nodes.push({
      id: `cat_${cat.id}`,
      name: cat.data.name,
      category: 'category',
      mass: 80,
    });
    // Connect categories to core
    links.push({ source: 'jaja_dev', target: `cat_${cat.id}`, value: 2 });
  });

  // 3. Technologies
  tech.forEach(t => {
    nodes.push({
      id: `tech_${t.id}`,
      name: t.data.name,
      category: 'tech',
      mass: 40,
    });
    // Connect tech to its generic category if it existed, but here we'll connect them to a general 'tech' category
    links.push({ source: 'cat_tech', target: `tech_${t.id}`, value: 1 });
  });

  // 4. Projects
  projects.forEach(p => {
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
      techStack: p.data.techStack?.map(ref => ref.id),
      inDevelopment: p.data.inDevelopment,
      mass: mass,
    });

    // Connect project to its category
    links.push({ source: `cat_${p.data.category.id}`, target: `project_${p.id}`, value: 2 });

    // Connect project to its technologies
    p.data.techStack?.forEach(tRef => {
      links.push({ source: `project_${p.id}`, target: `tech_${tRef.id}`, value: 1.5 });
    });
  });

  // 5. Ghost Nodes (1.5x Expansion Rule)
  // n real projects -> 0.5n ghost nodes
  const ghostCount = Math.floor(projects.length * 0.5);
  const ghostNames = [
    'Project X-RAY', 'Neural Engine', 'Quantum Bridge', 'Cyber Sentinel',
    'Data Vortex', 'Nexus Core v2', 'Shadow Protocol', 'Edge Intelligence'
  ];

  for (let i = 0; i < ghostCount; i++) {
    const targetProject = projects[i % projects.length];
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
    links.push({
      source: `project_${targetProject.id}`,
      target: ghostId,
      value: 1
    });
  }

  return { nodes, links };
}
