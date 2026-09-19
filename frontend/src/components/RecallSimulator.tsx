import type { InvestigationResponse } from '../api/types';

interface Props {
  result: InvestigationResponse | null;
  onApplyRecall: () => Promise<void>;
  isRecalling: boolean;
  recallError: string | null;
}

export const RecallSimulator: React.FC<Props> = ({ result, onApplyRecall, isRecalling, recallError }) => {
  if (!result || !result.batch) return null;

  const isContaminated = result.batch.status === 'CONTAMINATED';

  return (
    <section className="bg-slate-50 border border-slate-200 p-6 max-w-2xl mx-auto mt-12">
      <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 border-b border-slate-200 pb-2">
        {isContaminated ? 'Recall Executed' : 'What-If Recall Simulator'}
      </h2>
      
      {!isContaminated ? (
        <>
          <p className="text-xs text-slate-600 mb-6 font-medium">
            SIMULATION — LIVE GRAPH UNCHANGED
          </p>

          <div className="space-y-3 text-sm text-slate-700 mb-6">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span>Kitchens affected</span>
              <span className="font-bold">{result.impact.kitchens}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span>Dishes affected</span>
              <span className="font-bold">{result.impact.dishes}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span>Orders affected</span>
              <span className="font-bold">{result.impact.orders}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span>Customers affected</span>
              <span className="font-bold">{result.impact.customers}</span>
            </div>
          </div>

          <div>
            <button 
              onClick={onApplyRecall}
              disabled={isRecalling}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2.5 font-bold tracking-wide uppercase text-xs transition-colors rounded-none w-full"
            >
              {isRecalling ? 'EXECUTING RECALL...' : 'APPLY RECALL'}
            </button>
          </div>
          {recallError && (
            <div className="mt-3 text-xs text-red-600 font-medium">
              {recallError}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-slate-900 mb-2">{result.batch.id}</div>
          <div className="text-sm font-bold text-red-600 uppercase tracking-widest mb-6">CONTAMINATED</div>
          <div className="text-xs font-bold text-slate-500 bg-slate-200 inline-block px-4 py-2 uppercase tracking-widest">
            VERIFIED FROM LIVE GRAPH
          </div>
        </div>
      )}
    </section>
  );
};
