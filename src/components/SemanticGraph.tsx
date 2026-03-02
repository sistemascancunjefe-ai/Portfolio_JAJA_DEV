import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import type { NexusNode, NexusLink } from '../utils/nexusDataTransformer';
import PostProcessingOverlay from './PostProcessingOverlay';
import { Canvas } from '@react-three/fiber';
import NucleusCore from './NucleusCore';

interface Props {
  initialNodes: NexusNode[];
  initialLinks: NexusLink[];
}

const SemanticGraph: React.FC<Props> = ({ initialNodes, initialLinks }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NexusNode | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [simulation, setSimulation] = useState<d3.Simulation<any, undefined> | null>(null);
  const [corePos, setCorePos] = useState({ x: 0, y: 0 });

  // Performance logic
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const checkFps = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        if (frameCount < 45) setIsLowPerformance(true);
        else setIsLowPerformance(false);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(checkFps);
    };

    animId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    const tealGradient = defs.append('radialGradient').attr('id', 'teal-gradient');
    tealGradient.append('stop').attr('offset', '0%').attr('stop-color', '#00f2fe');
    tealGradient.append('stop').attr('offset', '100%').attr('stop-color', '#4facfe');

    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const sim = d3.forceSimulation(initialNodes as any)
      .force('link', d3.forceLink(initialLinks).id((d: any) => d.id).distance(d => 150 - ((d.source as any).mass / 10)))
      .force('charge', d3.forceManyBody().strength((d: any) => -500 * (d.mass / 100)))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.mass / 2 + 20))
      .force('x', d3.forceX(width / 2).strength(0.02))
      .force('y', d3.forceY(height / 2).strength(0.02));

    setSimulation(sim);

    const link = svg.append('g')
      .attr('stroke', '#4facfe')
      .attr('stroke-opacity', 0.15)
      .selectAll('line')
      .data(initialLinks)
      .join('line')
      .attr('stroke-dasharray', (d: any) => d.target.category === 'ghost' ? '5,5' : 'none')
      .attr('stroke-width', d => Math.sqrt(d.value) * 1.5);

    let hoverTimer: any;

    const node = svg.append('g')
      .selectAll('g')
      .data(initialNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);

        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          handleDeepDive(d);
        }, 7000);

        d3.select(event.currentTarget).select('circle')
          .transition().duration(300)
          .attr('r', d.mass / 2 + 10)
          .style('filter', 'url(#glow)');
      })
      .on('mouseleave', (event, d) => {
        setHoveredNode(null);
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = null;

        if (!isExpanded) {
          d3.select(event.currentTarget).select('circle')
            .transition().duration(300)
            .attr('r', d.mass / 2)
            .style('filter', d.category === 'ghost' ? 'none' : 'url(#glow)');
        }
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        handleDeepDive(d);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => d.mass / 2)
      .attr('fill', d => d.category === 'core' ? 'transparent' : 'url(#teal-gradient)')
      .style('filter', d => (d.category === 'ghost' || d.category === 'core') ? 'none' : 'url(#glow)')
      .attr('stroke', d => d.category === 'ghost' ? '#4facfe' : d.category === 'core' ? 'transparent' : '#fff')
      .attr('stroke-width', d => d.category === 'ghost' ? 1 : 2)
      .attr('stroke-dasharray', d => d.category === 'ghost' ? '3,3' : 'none')
      .attr('opacity', d => d.category === 'ghost' ? 0.3 : 0.9);

    node.append('text')
      .attr('dy', d => d.mass / 2 + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('text-transform', 'uppercase')
      .style('pointer-events', 'none')
      .text(d => d.id === 'jaja_dev' ? '' : d.name);

    sim.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => {
        if (d.id === 'jaja_dev') {
            setCorePos({ x: d.x, y: d.y });
        }
        return `translate(${d.x},${d.y})`;
      });
    });

    function dragstarted(event: any) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) sim.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      sim.stop();
    };
  }, [initialNodes, initialLinks]);

  const handleDeepDive = (node: NexusNode) => {
    setSelectedNode(node);
    setIsExpanded(true);

    if (simulation) {
        simulation.alphaTarget(0.3).restart();
        initialNodes.forEach((n: any) => {
            if (n.id === node.id) {
                n.fx = window.innerWidth / 2;
                n.fy = window.innerHeight / 2;
            }
        });
    }
  };

  const closeDeepDive = () => {
    setIsExpanded(false);
    if (simulation) {
        initialNodes.forEach((n: any) => {
            n.fx = null;
            n.fy = null;
        });
        simulation.alphaTarget(0);
    }
  };

  const handleSystemBreach = () => {
    window.location.href = '/portfolio';
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#050810] overflow-hidden">
      <svg ref={svgRef} className={`transition-all duration-1000 ${isExpanded ? 'blur-md grayscale scale-110 opacity-30' : ''}`}></svg>

      {/* Nucleus Core Component */}
      <div
        className="absolute pointer-events-none transition-transform duration-75"
        style={{
            left: corePos.x,
            top: corePos.y,
            width: 0,
            height: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
        }}
      >
        <div
          style={{ width: 120, height: 120, pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => { const nucleus = initialNodes.find(n => n.id === 'jaja_dev'); if (nucleus) handleDeepDive(nucleus); }}
        >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <NucleusCore />
            </Canvas>
        </div>
      </div>

      <PostProcessingOverlay isDeepDive={isExpanded} isLowPerformance={isLowPerformance} />

      {/* Hover Info */}
      <AnimatePresence>
        {hoveredNode && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 p-6 rounded-xl bg-black/60 backdrop-blur-md border border-teal-500/30 text-center pointer-events-none z-20"
          >
            <h2 className="text-2xl font-bold text-white">{hoveredNode.name}</h2>
            {hoveredNode.category === 'ghost' ? (
                <div className="text-orange-500 font-mono text-xs mt-2 animate-pulse">
                    CLASSIFIED: SYSTEM UPGRADE IN PROGRESS
                </div>
            ) : (
                <>
                {hoveredNode.subtitle && (
                    <p className="text-teal-400 font-mono text-sm mt-1">{hoveredNode.subtitle}</p>
                )}
                <p className="text-gray-400 mt-2 text-sm max-w-xs">{hoveredNode.description}</p>
                <div className="mt-4 text-[10px] text-teal-300/50 uppercase tracking-widest">
                    Hold 7s for Deep Dive
                </div>
                </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep Dive Environment */}
      <AnimatePresence>
        {isExpanded && selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-transparent"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="max-w-4xl w-full bg-[#0a0e1a]/90 backdrop-blur-2xl border border-teal-500/50 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(20,184,166,0.2)] relative"
            >
              <button
                onClick={closeDeepDive}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-30"
              >
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div className="grid md:grid-cols-2 h-full">
                <div className="p-12 bg-gradient-to-br from-teal-500/10 to-transparent flex flex-col justify-center border-r border-white/5">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl ${selectedNode.category === 'core' ? 'bg-orange-600' : 'bg-teal-600'}`}>
                    <span className="text-4xl font-bold text-white">{selectedNode.name[0]}</span>
                  </div>
                  <h2 className="text-5xl font-black text-white leading-tight mb-2 tracking-tighter">
                    {selectedNode.name}
                  </h2>
                  <p className="text-teal-400 font-mono text-xl mb-6">{selectedNode.subtitle}</p>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                <div className="p-12 flex flex-col justify-center bg-black/40">
                  {selectedNode.metrics && (
                    <div className="space-y-6 mb-10">
                      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em]">Performance Metrics</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedNode.metrics.map((m, i) => (
                          <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:border-teal-500/30 transition-colors">
                            <div className="text-4xl font-black text-orange-500 group-hover:text-teal-400 transition-colors">{m.value}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNode.techStack && (
                    <div className="mb-10">
                       <h3 className="text-xs font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">Tech Infrastructure</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedNode.techStack.map((tech, i) => (
                            <span key={i} className="px-4 py-2 bg-teal-500/5 text-teal-300 border border-teal-500/20 rounded-xl text-xs font-mono">
                                {tech}
                            </span>
                            ))}
                        </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {selectedNode.link && (
                      <a
                        href={selectedNode.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-teal-500 text-black font-black py-5 rounded-2xl hover:bg-teal-400 transition-colors uppercase tracking-widest text-sm flex items-center justify-center"
                      >
                        Launch
                      </a>
                    )}
                    <button
                      onClick={() => {
                          if (selectedNode.id === 'jaja_dev') handleSystemBreach();
                          else closeDeepDive();
                      }}
                      className="flex-1 bg-white text-black font-black py-5 rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                    >
                      {selectedNode.id === 'jaja_dev' ? 'Breach Portfolio' : 'Close Analysis'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SemanticGraph;
