import { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import type { Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import type { InvestigationResponse, SimulateContainmentResponse } from '../api/types';

interface Props {
  result: InvestigationResponse | null;
  simResult?: SimulateContainmentResponse | null;
}

export const ImpactGraph: React.FC<Props> = ({ result, simResult }) => {
  const { nodes, edges } = useMemo(() => {
    if (!result || !result.batch) return { nodes: [], edges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    const baseNodeStyle = {
      color: '#FFFFFF',
      width: 140,
      padding: '12px 8px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      textAlign: 'center' as const,
      border: 'none',
      borderRadius: '0',
      transition: 'all 0.3s',
      fontWeight: 'bold',
      letterSpacing: '0.05em'
    };
    
    const containedStyle = {
      opacity: 0.25,
      filter: 'grayscale(100%)'
    };

    const isContained = (type: string, id: string) => {
      if (!simResult) return false;
      if (type === 'k' && simResult.contained.kitchens.find(x => x.id === id)) return true;
      if (type === 'd' && simResult.contained.dishes.find(x => x.id === id)) return true;
      if (type === 'o' && simResult.contained.orders.find(x => x.id === id)) return true;
      if (type === 'c' && simResult.contained.customers.find(x => x.id === id)) return true;
      return false;
    };

    const edgeStyle = (contained: boolean) => ({
      stroke: contained ? '#D9DADD' : '#52545A',
      strokeWidth: 2,
      opacity: contained ? 0.3 : 1
    });

    const edgeLabelStyle = { fill: '#52545A', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-sans)' };
    const edgeBgStyle = { fill: '#F7F7F5', fillOpacity: 0.9 };

    // Batch: #3B1118 (burgundy)
    newNodes.push({
      id: `b-${result.batch.id}`,
      data: { label: `BATCH\n${result.batch.id}` },
      position: { x: 50, y: 150 },
      style: { ...baseNodeStyle, background: '#3B1118' }
    });

    // Kitchens: #315C7D (info blue)
    result.kitchens.forEach((k, i) => {
      const contained = isContained('k', k.id);
      newNodes.push({
        id: `k-${k.id}`,
        data: { label: `KITCHEN\n${k.id}` },
        position: { x: 300, y: 50 + i * 120 },
        style: { ...baseNodeStyle, background: '#315C7D', ...(contained ? containedStyle : {}) }
      });
      newEdges.push({
        id: `e-b-${result.batch!.id}-k-${k.id}`,
        source: `b-${result.batch!.id}`,
        target: `k-${k.id}`,
        label: 'DELIVERED TO',
        labelStyle: edgeLabelStyle,
        labelBgStyle: edgeBgStyle,
        style: edgeStyle(contained)
      });
    });

    // Dishes: #66717C
    result.dishes.forEach((d, i) => {
      const contained = isContained('d', d.id);
      newNodes.push({
        id: `d-${d.id}`,
        data: { label: `DISH\n${d.id}` },
        position: { x: 550, y: 50 + i * 90 },
        style: { ...baseNodeStyle, background: '#66717C', ...(contained ? containedStyle : {}) }
      });
      result.kitchens.forEach(k => {
        const kContained = isContained('k', k.id);
        const edgeContained = kContained || contained;
        
        newEdges.push({
          id: `e-k-${k.id}-d-${d.id}`,
          source: `k-${k.id}`,
          target: `d-${d.id}`,
          label: 'USED IN',
          labelStyle: edgeLabelStyle,
          labelBgStyle: edgeBgStyle,
          style: edgeStyle(edgeContained)
        });
      });
    });

    // Orders: #8B939A
    result.orders.forEach((o, i) => {
      const contained = isContained('o', o.id);
      newNodes.push({
        id: `o-${o.id}`,
        data: { label: `ORDER\n${o.id}` },
        position: { x: 800, y: 50 + i * 70 },
        style: { ...baseNodeStyle, background: '#8B939A', ...(contained ? containedStyle : {}) }
      });
      result.dishes.forEach(d => {
        newEdges.push({
          id: `e-d-${d.id}-o-${o.id}`,
          source: `d-${d.id}`,
          target: `o-${o.id}`,
          label: 'ORDERED AS',
          labelStyle: edgeLabelStyle,
          labelBgStyle: edgeBgStyle,
          style: edgeStyle(contained)
        });
      });
    });

    // Customers: #AEB4B9
    result.customers.forEach((c, i) => {
      const contained = isContained('c', c.id);
      newNodes.push({
        id: `c-${c.id}`,
        data: { label: `CUSTOMER\n${c.id}` },
        position: { x: 1050, y: 50 + i * 70 },
        style: { ...baseNodeStyle, background: '#AEB4B9', color: '#171719', ...(contained ? containedStyle : {}) }
      });
      result.orders.forEach(o => {
        newEdges.push({
          id: `e-o-${o.id}-c-${c.id}`,
          source: `o-${o.id}`,
          target: `c-${c.id}`,
          label: 'PLACED BY',
          labelStyle: edgeLabelStyle,
          labelBgStyle: edgeBgStyle,
          style: edgeStyle(contained)
        });
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [result, simResult]);

  if (!result) return null;

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-[10px] font-bold text-ink tracking-widest uppercase bg-surface px-3 py-1.5 border border-ui-border shadow-sm">
          Traceability Graph
        </h2>
      </div>
      {simResult && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex gap-4 text-[10px] font-bold tracking-widest uppercase bg-surface px-3 py-1.5 border border-ui-border shadow-sm">
            <span className="text-simulation">● Affected by simulation</span>
            <span className="text-muted">○ Contained (Out of scope)</span>
          </div>
        </div>
      )}
      <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.1, duration: 800 }} minZoom={0.2} maxZoom={2}>
        <Background color="#D9DADD" gap={20} />
        <Controls className="bg-surface fill-ink border-ui-border shadow-none" />
      </ReactFlow>
    </div>
  );
};
