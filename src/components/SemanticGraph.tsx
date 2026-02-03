import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { nexusNodes, nexusLinks, type NexusNode } from '../data/nexusData';
import { motion, AnimatePresence } from 'framer-motion';

const SemanticGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NexusNode | null>(null);
  const [expansionTimer, setExpansionTimer] = useState<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    // Defs for gradients and filters
    const defs = svg.append('defs');

    // Teal Gradient for normal nodes
    const tealGradient = defs.append('radialGradient')
      .attr('id', 'teal-gradient');
    tealGradient.append('stop').attr('offset', '0%').attr('stop-color', '#00f2fe');
    tealGradient.append('stop').attr('offset', '100%').attr('stop-color', '#4facfe');

    // Orange-to-Blue Gradient for Core Node
    const coreGradient = defs.append('linearGradient')
      .attr('id', 'core-gradient')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    coreGradient.append('stop').attr('offset', '0%').attr('stop-color', '#FF6600');
    coreGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0066B3');

    // Glow Filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const simulation = d3.forceSimulation(nexusNodes as any)
      .force('link', d3.forceLink(nexusLinks).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80));

    const link = svg.append('g')
      .attr('stroke', '#4facfe')
      .attr('stroke-opacity', 0.2)
      .selectAll('line')
      .data(nexusLinks)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    const node = svg.append('g')
      .selectAll('g')
      .data(nexusNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        const timer = setTimeout(() => {
          setSelectedNode(d);
          setIsExpanded(true);
        }, 7000);
        setExpansionTimer(timer);

        d3.select(event.currentTarget).select('circle')
          .transition().duration(300)
          .attr('r', d.category === 'core' ? 60 : 40)
          .style('filter', 'url(#glow)');
      })
      .on('mouseleave', (event, d) => {
        setHoveredNode(null);
        if (expansionTimer) clearTimeout(expansionTimer);
        setExpansionTimer(null);

        d3.select(event.currentTarget).select('circle')
          .transition().duration(300)
          .attr('r', d.category === 'core' ? 50 : 30)
          .style('filter', d.category === 'ghost' ? 'none' : 'url(#glow)');
      })
      .on('click', (event, d) => {
        if (d.id === 'jaja_dev') {
          window.location.href = '/portfolio';
        } else {
          setSelectedNode(d);
          setIsExpanded(true);
        }
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => d.category === 'core' ? 50 : 30)
      .attr('fill', d => d.category === 'core' ? 'url(#core-gradient)' : 'url(#teal-gradient)')
      .style('filter', d => d.category === 'ghost' ? 'none' : 'url(#glow)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', d => d.category === 'ghost' ? 0.4 : 0.9);

    node.append('text')
      .attr('dy', d => d.category === 'core' ? 70 : 50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('text-transform', 'uppercase')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050810] overflow-hidden">
      <svg ref={svgRef}></svg>

      {/* Hover Info */}
      <AnimatePresence>
        {hoveredNode && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 p-6 rounded-xl bg-black/60 backdrop-blur-md border border-teal-500/30 text-center pointer-events-none"
          >
            <h2 className="text-2xl font-bold text-white">{hoveredNode.name}</h2>
            {hoveredNode.subtitle && (
              <p className="text-teal-400 font-mono text-sm mt-1">{hoveredNode.subtitle}</p>
            )}
            <p className="text-gray-400 mt-2 text-sm max-w-xs">{hoveredNode.description}</p>
            <div className="mt-4 text-xs text-teal-300 animate-pulse">
              Mantén el cursor para explorar más...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Overlay (7-second rule) */}
      <AnimatePresence>
        {isExpanded && selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl z-50 p-4"
          >
            <div className="max-w-2xl w-full bg-[#131824] border border-teal-500/50 rounded-3xl overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedNode.category === 'core' ? 'bg-orange-500' : 'bg-teal-500'}`}>
                    <span className="text-2xl font-bold text-white">{selectedNode.name[0]}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedNode.name}</h2>
                    <p className="text-teal-400 font-mono">{selectedNode.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {selectedNode.description}
                </p>

                {selectedNode.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {selectedNode.metrics.map((m, i) => (
                      <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="text-2xl font-bold text-orange-500">{m.value}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedNode.techStack && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedNode.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {selectedNode.inDevelopment && (
                  <div className="bg-orange-500/20 border border-orange-500/50 p-4 rounded-xl text-orange-500 font-bold text-center animate-pulse">
                    🚧 PROJECT UNDER DEVELOPMENT / CLASSIFIED
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => {
                        if (selectedNode.id === 'jaja_dev') window.location.href = '/portfolio';
                        else setIsExpanded(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity"
                  >
                    {selectedNode.id === 'jaja_dev' ? 'ENTRAR AL PORTAFOLIO' : 'CONOCER MÁS'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemanticGraph;
