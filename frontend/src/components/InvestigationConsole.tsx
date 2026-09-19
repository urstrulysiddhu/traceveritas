import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onInvestigate: (batchId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  defaultBatchId?: string;
}

export const InvestigationConsole: React.FC<Props> = ({ onInvestigate, isLoading, error, defaultBatchId = 'B002' }) => {
  const [batchId, setBatchId] = useState(defaultBatchId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (batchId.trim()) {
      onInvestigate(batchId.trim());
    }
  };

  return (
    <section className="text-center py-8">
      <h2 className="text-2xl font-bold text-slate-900 tracking-wide mb-2 uppercase">Contamination Investigation</h2>
      <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">
        Trace downstream operational impact from a supplier or batch through the connected supply chain.
      </p>
      
      <form onSubmit={handleSubmit} className="flex items-end justify-center gap-4 max-w-xl mx-auto">
        <div className="text-left w-1/3">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Entity Type</label>
          <select className="bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 rounded-none w-full">
            <option value="batch">Batch</option>
            <option value="supplier" disabled>Supplier</option>
          </select>
        </div>
        <div className="text-left w-1/3">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Entity ID</label>
          <input 
            type="text" 
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 rounded-none w-full"
            placeholder="e.g. B002"
          />
        </div>
        <div className="w-1/3">
          <button 
            type="submit" 
            disabled={isLoading || !batchId.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 font-bold tracking-wide uppercase text-xs transition-colors rounded-none w-full"
          >
            {isLoading ? 'Running...' : 'Run Investigation'}
          </button>
        </div>
      </form>
      {error && (
        <div className="mt-4 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}
    </section>
  );
};
