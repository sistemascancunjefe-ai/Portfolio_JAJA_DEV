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
  mass?: number;
}

export interface NexusLink {
  source: string;
  target: string;
  value: number;
}
