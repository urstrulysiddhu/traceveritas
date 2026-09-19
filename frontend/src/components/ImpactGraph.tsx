import { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import type { Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import type { InvestigationResponse } from '../api/types';

interface Props {
  result: InvestigationResponse | null;
}

export const ImpactGraph: React.FC<Props> = ({ result }) => {
  const { nodes, edges } = useMemo(() => {
    if (!result || !result.batch) return { nodes: [], edges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    const baseNodeStyle = {
      background: '#ffffff',
      color: '#0f172a',
      width: 120,
      padding: '8px 4px',
      fontSize: '10px',
      textAlign: 'center' as const,
      border: '1px solid #cbd5e1'
    };

    // Batch (Solid dark border)
    newNodes.push({
      id: `b-${result.batch.id}`,
      data: { label: `BATCH\n${result.batch.id}` },
      position: { x: 50, y: 150 },
      style: { ...baseNodeStyle, border: '2px solid #0f172a', fontWeight: 'bold' }
    });

    // Kitchens (Dashed border)
    result.kitchens.forEach((k, i) => {
      newNodes.push({
        id: `k-${k.id}`,
        data: { label: `KITCHEN\n${k.id}` },
        position: { x: 260, y: 50 + i * 100 },
        style: { ...baseNodeStyle, border: '1px dashed #64748b' }
      });
      newEdges.push({
        id: `e-b-${result.batch!.id}-k-${k.id}`,
        source: `b-${result.batch!.id}`,
        target: `k-${k.id}`,
        label: 'DELIVERED TO',
        labelStyle: { fill: '#64748b', fontSize: 8, fontWeight: 700 },
        labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
        style: { stroke: '#94a3b8' }
      });
    });

    // Dishes (Dotted border)
    result.dishes.forEach((d, i) => {
      newNodes.push({
        id: `d-${d.id}`,
        data: { label: `DISH\n${d.id}` },
        position: { x: 470, y: 50 + i * 80 },
        style: { ...baseNodeStyle, border: '1px dotted #94a3b8' }
      });
      result.kitchens.forEach(k => {
        newEdges.push({
          id: `e-k-${k.id}-d-${d.id}`,
          source: `k-${k.id}`,
          target: `d-${d.id}`,
          label: 'USED IN',
          labelStyle: { fill: '#94a3b8', fontSize: 8, fontWeight: 700 },
          labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
          style: { stroke: '#cbd5e1' }
        });
      });
    });

    // Orders (Solid light border)
    result.orders.forEach((o, i) => {
      newNodes.push({
        id: `o-${o.id}`,
        data: { label: `ORDER\n${o.id}` },
        position: { x: 680, y: 50 + i * 60 },
        style: { ...baseNodeStyle }
      });
      result.dishes.forEach(d => {
        newEdges.push({
          id: `e-d-${d.id}-o-${o.id}`,
          source: `d-${d.id}`,
          target: `o-${o.id}`,
          label: 'ORDERED AS',
          labelStyle: { fill: '#cbd5e1', fontSize: 8, fontWeight: 700 },
          labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
          style: { stroke: '#e2e8f0' }
        });
      });
    });

    // Customers (Solid light border)
    result.customers.forEach((c, i) => {
      newNodes.push({
        id: `c-${c.id}`,
        data: { label: `CUSTOMER\n${c.id}` },
        position: { x: 890, y: 50 + i * 60 },
        style: { ...baseNodeStyle, background: '#f1f5f9' }
      });
      result.orders.forEach(o => {
        newEdges.push({
          id: `e-o-${o.id}-c-${c.id}`,
          source: `o-${o.id}`,
          target: `c-${c.id}`,
          label: 'PLACED BY',
          labelStyle: { fill: '#cbd5e1', fontSize: 8, fontWeight: 700 },
          labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
          style: { stroke: '#e2e8f0' }
        });
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [result]);

  if (!result) return null;

  return (
    <section className="mt-12">
      <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 border-b border-slate-200 pb-2">Traceability Diagram</h2>
      <div className="h-[500px] w-full border border-slate-200 bg-slate-50">
        <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.2}>
          <Background color="#cbd5e1" gap={16} />
          <Controls className="bg-white fill-slate-700 border-slate-200" />
        </ReactFlow>
      </div>
    </section>
  );
};
