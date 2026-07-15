import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, HelpCircle } from 'lucide-react';

export default function RelationshipGraph({ people, onSelectPerson }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  
  // Set up nodes and links from database
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const draggedNodeRef = useRef(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, startX: 0, startY: 0 });

  // Initialize nodes and links
  useEffect(() => {
    // 1. Build nodes list
    const initialNodes = people.map((p, idx) => {
      const angle = (idx / people.length) * Math.PI * 2;
      const radius = 200 + Math.random() * 50;
      return {
        id: p.id,
        label: p.name.split(" (")[0], // Short name
        x: 450 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: p.id === 'the_bab' || p.id === 'bahaullah' ? 24 : 16,
        color: p.id === 'the_bab' || p.id === 'bahaullah' ? '#b8860b' : 
               p.id === 'mulla_husayn' || p.id === 'quddus' || p.id === 'tahirih' || p.id === 'vahid' || p.id === 'hujjat' ? '#c29b38' : '#8c7d70',
        textColor: '#fff'
      };
    });

    // 2. Build links list
    const initialLinks = [];
    people.forEach(p => {
      if (p.relations) {
        p.relations.forEach(r => {
          // Verify target exists
          const targetExists = people.some(t => t.id === r.targetId);
          if (targetExists) {
            initialLinks.push({
              source: p.id,
              target: r.targetId,
              label: r.type
            });
          }
        });
      }
    });

    nodesRef.current = initialNodes;
    linksRef.current = initialLinks;
    
    // Reset offset to center
    transformRef.current = { x: 0, y: 0, scale: 1 };
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [people]);

  // Force-directed simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const width = canvas.width;
    const height = canvas.height;

    // Simulation forces constants
    const repellingForce = 1200;
    const linkForce = 0.05;
    const linkLength = 120;
    const gravity = 0.03;
    const damping = 0.85;

    const updateSimulation = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const dragNode = draggedNodeRef.current;

      // 1. Repulsive forces between nodes
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy + 0.1;
          const dist = Math.sqrt(distSq);

          if (dist < 350) {
            const force = repellingForce / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (nodeA !== dragNode) {
              nodeA.vx -= fx;
              nodeA.vy -= fy;
            }
            if (nodeB !== dragNode) {
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }
      }

      // 2. Link forces (attractive)
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);

        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          
          const force = (dist - linkLength) * linkForce;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (sourceNode !== dragNode) {
            sourceNode.vx += fx;
            sourceNode.vy += fy;
          }
          if (targetNode !== dragNode) {
            targetNode.vx -= fx;
            targetNode.vy -= fy;
          }
        }
      });

      // 3. Gravity towards center
      const centerX = width / 2;
      const centerY = height / 2;
      nodes.forEach(node => {
        if (node === dragNode) return;
        
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        
        node.vx += dx * gravity;
        node.vy += dy * gravity;

        // Apply velocities & damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= damping;
        node.vy *= damping;

        // Keep inside canvas bounds loosely
        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Save state and apply translations/zooms
      ctx.save();
      ctx.translate(transformRef.current.x, transformRef.current.y);
      ctx.scale(transformRef.current.scale, transformRef.current.scale);

      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Draw links
      ctx.lineWidth = 1.5;
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          
          // Style line
          const isDark = document.body.parentElement.getAttribute('data-theme') === 'dark';
          ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(184, 134, 11, 0.15)';
          ctx.stroke();

          // Draw little arrow or label mid-point
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;

          ctx.font = '9px sans-serif';
          ctx.fillStyle = isDark ? 'rgba(235, 229, 220, 0.4)' : 'rgba(26, 20, 18, 0.4)';
          ctx.textAlign = 'center';
          ctx.fillText(link.label.toLowerCase(), midX, midY - 4);
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        const isDark = document.body.parentElement.getAttribute('data-theme') === 'dark';
        
        // Dynamic node gradient
        const grad = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, node.radius);
        if (node.id === 'the_bab' || node.id === 'bahaullah') {
          grad.addColorStop(0, isDark ? '#ffdf7a' : '#d4af37');
          grad.addColorStop(1, isDark ? '#b8860b' : '#996515');
        } else {
          grad.addColorStop(0, isDark ? '#e5c158' : '#c29b38');
          grad.addColorStop(1, isDark ? '#8c7d70' : '#5c4f48');
        }

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        ctx.fill();

        // Clear shadow
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
        ctx.stroke();

        // Node Label
        ctx.font = node.id === 'the_bab' || node.id === 'bahaullah' ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isDark ? '#ebe5dc' : '#1a1310';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + node.radius + 6);
      });

      ctx.restore();
    };

    const tick = () => {
      updateSimulation();
      draw();
      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Coordinate conversion helper
  const getMousePosInCanvas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const toWorldCoords = (screenX, screenY) => {
    const transform = transformRef.current;
    return {
      x: (screenX - transform.x) / transform.scale,
      y: (screenY - transform.y) / transform.scale
    };
  };

  // Mouse Handlers
  const handleMouseDown = (e) => {
    const pos = getMousePosInCanvas(e);
    const worldPos = toWorldCoords(pos.x, pos.y);
    
    // Check if clicked a node
    const nodes = nodesRef.current;
    const clickedNode = nodes.find(node => {
      const dx = node.x - worldPos.x;
      const dy = node.y - worldPos.y;
      return dx * dx + dy * dy < (node.radius + 10) * (node.radius + 10);
    });

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      clickedNode.vx = 0;
      clickedNode.vy = 0;
    } else {
      // Panning mode
      mouseRef.current.isDown = true;
      mouseRef.current.startX = pos.x - transformRef.current.x;
      mouseRef.current.startY = pos.y - transformRef.current.y;
    }
  };

  const handleMouseMove = (e) => {
    const pos = getMousePosInCanvas(e);
    const dragNode = draggedNodeRef.current;

    if (dragNode) {
      const worldPos = toWorldCoords(pos.x, pos.y);
      dragNode.x = worldPos.x;
      dragNode.y = worldPos.y;
      dragNode.vx = 0;
      dragNode.vy = 0;
    } else if (mouseRef.current.isDown) {
      const newX = pos.x - mouseRef.current.startX;
      const newY = pos.y - mouseRef.current.startY;
      transformRef.current = {
        ...transformRef.current,
        x: newX,
        y: newY
      };
      setOffsetX(newX);
      setOffsetY(newY);
    }
  };

  const handleMouseUp = (e) => {
    const dragNode = draggedNodeRef.current;
    if (dragNode) {
      // If we didn't drag it far, treat it as a click
      onSelectPerson(dragNode.id);
      draggedNodeRef.current = null;
    }
    mouseRef.current.isDown = false;
  };

  // Zoom helpers
  const adjustZoom = (factor) => {
    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const oldScale = transformRef.current.scale;
    const newScale = Math.max(0.4, Math.min(2.5, oldScale * factor));
    
    // Zoom centered on canvas middle
    const newX = centerX - (centerX - transformRef.current.x) * (newScale / oldScale);
    const newY = centerY - (centerY - transformRef.current.y) * (newScale / oldScale);

    transformRef.current = {
      x: newX,
      y: newY,
      scale: newScale
    };

    setZoom(newScale);
    setOffsetX(newX);
    setOffsetY(newY);
  };

  const resetGraph = () => {
    transformRef.current = { x: 0, y: 0, scale: 1 };
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    
    // Jitter positions slightly to kickstart the simulation
    nodesRef.current.forEach(node => {
      node.vx = (Math.random() - 0.5) * 5;
      node.vy = (Math.random() - 0.5) * 5;
    });
  };

  return (
    <div className="graph-container">
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <h4 className="section-label" style={{ margin: 0 }}>Interactive Connections Map</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => adjustZoom(1.2)} className="theme-toggle-btn" style={{ padding: '0.3rem 0.6rem', borderRadius: '8px' }} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => adjustZoom(0.85)} className="theme-toggle-btn" style={{ padding: '0.3rem 0.6rem', borderRadius: '8px' }} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button onClick={resetGraph} className="theme-toggle-btn" style={{ padding: '0.3rem 0.6rem', borderRadius: '8px' }} title="Recenter / Jitter">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={900}
        height={500}
        className="graph-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />

      <div className="graph-controls">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <HelpCircle size={14} />
          Drag nodes to arrange them. Drag the background to pan. Click nodes to view bios.
        </span>
      </div>

      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'linear-gradient(#ffdf7a, #b8860b)' }}></div>
          <span>Manifestations (Báb & Bahá'u'lláh)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#c29b38' }}></div>
          <span>Primary Apostles & Letter Leaders</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#8c7d70' }}></div>
          <span>Disciples & Opponents</span>
        </div>
      </div>
    </div>
  );
}
