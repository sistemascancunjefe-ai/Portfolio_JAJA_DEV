export interface NexusNode {
  id: string;
  name: string;
  subtitle?: string;
  category: 'core' | 'project' | 'tech' | 'category' | 'ghost';
  description?: string;
  metrics?: { label: string; value: string }[];
  techStack?: string[];
  link?: string;
  inDevelopment?: boolean;
}

export interface NexusLink {
  source: string;
  target: string;
  value: number;
}

const realNodes: NexusNode[] = [
  {
    id: 'jaja_dev',
    name: 'JAJA_DEV',
    subtitle: 'Core Ecosystem',
    category: 'core',
    description: 'The central nucleus of the Semantic Data Visualization Ecosystem. Gateway to professional identity and developer core.',
  },
  {
    id: 'sac',
    name: 'SAC',
    subtitle: 'Sistema de Automatización Completa',
    category: 'project',
    description: 'Ecosistema de 5 módulos para automatización end-to-end de procesos logísticos.',
    metrics: [
      { label: 'ROI', value: '3,411%' },
      { label: 'Ahorro Anual', value: '.1M MXN' },
      { label: 'Payback', value: '10 días' }
    ],
    techStack: ['Python', 'FastAPI', 'IBM DB2', 'React'],
  },
  {
    id: 'validador',
    name: 'Validador v5.0',
    subtitle: 'Validation Engine',
    category: 'project',
    description: 'Dashboard profesional para validación masiva de datos con precisión extrema.',
    metrics: [
      { label: 'Reducción Tiempo', value: '85-90%' },
      { label: 'Precisión', value: '99%+' },
      { label: 'Ahorro Mensual', value: '50h/analista' }
    ],
    techStack: ['React', 'TailwindCSS', 'Python', 'Pandas'],
  },
  {
    id: 'preventiva',
    name: 'Validación Preventiva',
    subtitle: 'Proactive Intelligence',
    category: 'project',
    description: 'Cambio de paradigma: detección de problemas 5 días antes del recibo físico.',
    metrics: [
      { label: 'Anticipación', value: '5 días' },
      { label: 'Prevención', value: '100%' }
    ],
    techStack: ['Python', 'SQL', 'IBM DB2'],
  },
  {
    id: 'sql_maestro',
    name: 'SQL Maestro',
    subtitle: 'Query Optimization Lab',
    category: 'project',
    description: 'Repositorio consolidado y optimizado de consultas SQL enterprise-grade.',
    metrics: [
      { label: 'Reducción Archivos', value: '90%' },
      { label: 'Optimización', value: '24%' }
    ],
    techStack: ['SQL', 'IBM DB2', 'DBeaver'],
  },
  {
    id: 'a2u',
    name: 'A2U Project',
    subtitle: 'Classified Operation',
    category: 'project',
    description: 'Proyecto clasificado de inteligencia de datos y automatización avanzada (Acerta/SAT).',
    techStack: ['Big Data', 'Intelligence', 'Python'],
  },
  // Categories
  { id: 'cat_projects', name: 'Proyectos', category: 'category' },
  { id: 'cat_tech', name: 'Tecnologías', category: 'category' },
  { id: 'cat_apps', name: 'Aplicaciones', category: 'category' },
  { id: 'cat_webs', name: 'Sitios Webs', category: 'category' },
  { id: 'cat_contrib', name: 'Aportaciones', category: 'category' },
  { id: 'cat_media', name: 'Recursos Audiovisuales', category: 'category' },
  // Technologies
  { id: 'python', name: 'Python', category: 'tech' },
  { id: 'javascript', name: 'JavaScript', category: 'tech' },
  { id: 'react', name: 'React', category: 'tech' },
  { id: 'db2', name: 'IBM DB2', category: 'tech' },
  { id: 'fastapi', name: 'FastAPI', category: 'tech' },
  { id: 'sql', name: 'SQL', category: 'tech' },
  { id: 'pandas', name: 'Pandas', category: 'tech' },
  { id: 'tailwind', name: 'TailwindCSS', category: 'tech' },
  { id: 'wms', name: 'Manhattan WMS', category: 'tech' },
  { id: 'git', name: 'Git/GitHub', category: 'tech' },
];

const generateGhostNodes = (realCount: number): NexusNode[] => {
  const ghostCount = Math.floor(realCount * 0.5);
  const ghostNodes: NexusNode[] = [];
  const names = [
    'Project X-RAY', 'Neural Engine', 'Quantum Bridge', 'Cyber Sentinel',
    'Data Vortex', 'Nexus Core v2', 'Shadow Protocol', 'Edge Intelligence',
    'Bio-Logistics', 'Synth-Data Lab', 'Aether Grid', 'Void Automata', 'Prism OS'
  ];

  for (let i = 0; i < ghostCount; i++) {
    ghostNodes.push({
      id: `ghost_${i}`,
      name: names[i % names.length] || `Lab Project ${i}`,
      subtitle: 'CLASSIFIED',
      category: 'ghost',
      description: 'Under development in our clandestine innovation lab. Access restricted.',
      inDevelopment: true,
    });
  }
  return ghostNodes;
};

export const nexusNodes: NexusNode[] = [...realNodes, ...generateGhostNodes(realNodes.length)];

export const nexusLinks: NexusLink[] = [
  // Connect categories to core
  { source: 'jaja_dev', target: 'cat_projects', value: 2 },
  { source: 'jaja_dev', target: 'cat_tech', value: 2 },
  { source: 'jaja_dev', target: 'cat_apps', value: 2 },
  { source: 'jaja_dev', target: 'cat_webs', value: 2 },
  { source: 'jaja_dev', target: 'cat_contrib', value: 2 },
  { source: 'jaja_dev', target: 'cat_media', value: 2 },

  // Connect projects to their category
  { source: 'cat_projects', target: 'sac', value: 1 },
  { source: 'cat_projects', target: 'validador', value: 1 },
  { source: 'cat_projects', target: 'preventiva', value: 1 },
  { source: 'cat_projects', target: 'sql_maestro', value: 1 },
  { source: 'cat_projects', target: 'a2u', value: 1 },

  // Connect projects to techs
  { source: 'sac', target: 'python', value: 1 },
  { source: 'sac', target: 'fastapi', value: 1 },
  { source: 'sac', target: 'db2', value: 1 },
  { source: 'sac', target: 'react', value: 1 },

  { source: 'validador', target: 'react', value: 1 },
  { source: 'validador', target: 'tailwind', value: 1 },
  { source: 'validador', target: 'python', value: 1 },
  { source: 'validador', target: 'pandas', value: 1 },

  { source: 'preventiva', target: 'python', value: 1 },
  { source: 'preventiva', target: 'sql', value: 1 },
  { source: 'preventiva', target: 'db2', value: 1 },

  { source: 'sql_maestro', target: 'sql', value: 1 },
  { source: 'sql_maestro', target: 'db2', value: 1 },

  { source: 'a2u', target: 'python', value: 1 },

  // Connect techs to their category
  { source: 'cat_tech', target: 'python', value: 1 },
  { source: 'cat_tech', target: 'javascript', value: 1 },
  { source: 'cat_tech', target: 'react', value: 1 },
  { source: 'cat_tech', target: 'db2', value: 1 },
  { source: 'cat_tech', target: 'fastapi', value: 1 },

  // Ghost nodes connected to core or categories randomly
  ...nexusNodes
    .filter(n => n.category === 'ghost')
    .map(n => ({
      source: 'jaja_dev',
      target: n.id,
      value: 0.5
    }))
];
