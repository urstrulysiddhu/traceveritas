import { useState } from 'react';
import type { InvestigationResponse } from '../api/types';

interface Props {
  result: InvestigationResponse | null;
}

export const ViewCypher: React.FC<Props> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!result) return null;

  return (
    <section className="mt-8">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2 border-b border-slate-200 pb-2 cursor-pointer hover:text-slate-900 transition-colors"
      >
        VIEW CYPHER {isOpen ? '▼' : '▶'}
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Parameterized Query</div>
            <pre className="text-[10px] font-mono text-slate-800 bg-slate-50 p-4 border border-slate-200 overflow-x-auto whitespace-pre-wrap">
              {result.cypher}
            </pre>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase mb-1">Parameters</div>
            <pre className="text-[10px] font-mono text-slate-800 bg-slate-50 p-4 border border-slate-200 overflow-x-auto">
              {JSON.stringify(result.parameters, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
};
