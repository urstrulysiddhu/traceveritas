import type { InvestigationResponse } from '../api/types';

interface Props {
  result: InvestigationResponse;
}

export const ImpactSummary: React.FC<Props> = ({ result }) => {
  if (!result.batch) return null;

  return (
    <section>
      <div className="mb-12 text-center">
        <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 pb-2 border-b border-slate-200">Investigation Result</h2>
        <div className="text-3xl font-bold text-slate-900">{result.batch.id}</div>
        <div className="text-sm text-slate-700 font-medium">{result.batch.ingredient}</div>
        <div className="text-xs text-slate-500 flex justify-center gap-6 mt-3">
          <div><span className="font-semibold text-slate-700">Received:</span> {result.batch.received_date}</div>
          <div><span className="font-semibold text-slate-700">Expiry:</span> {result.batch.expiry_date}</div>
          <div>
            <span className="font-semibold text-slate-700">Status: </span> 
            <span className={result.batch.status === 'SAFE' ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
              {result.batch.status}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-6 text-center border-b border-slate-200 pb-2">Downstream Impact</h3>
      <div className="flex items-center justify-center gap-12 text-center text-slate-700 mb-12">
        <div>
          <div className="font-bold text-slate-900 text-5xl mb-2">{result.impact.kitchens}</div> 
          <div className="text-xs font-bold tracking-widest uppercase">Kitchens</div>
        </div>
        <div>
          <div className="font-bold text-slate-900 text-5xl mb-2">{result.impact.dishes}</div> 
          <div className="text-xs font-bold tracking-widest uppercase">Dishes</div>
        </div>
        <div>
          <div className="font-bold text-slate-900 text-5xl mb-2">{result.impact.orders}</div> 
          <div className="text-xs font-bold tracking-widest uppercase">Orders</div>
        </div>
        <div>
          <div className="font-bold text-slate-900 text-5xl mb-2">{result.impact.customers}</div> 
          <div className="text-xs font-bold tracking-widest uppercase">Customers</div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 border-b border-slate-200 pb-2">Operational Impact</h3>
        <div className="space-y-3 text-sm text-slate-700 font-medium bg-slate-50 p-6 border border-slate-200">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span>Kitchens requiring operational review</span>
            <span className="font-bold text-slate-900">{result.impact.kitchens}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span>Dishes requiring menu suppression</span>
            <span className="font-bold text-slate-900">{result.impact.dishes}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span>Customer orders potentially affected</span>
            <span className="font-bold text-slate-900">{result.impact.orders}</span>
          </div>
          <div className="flex justify-between">
            <span>Customers requiring notification</span>
            <span className="font-bold text-slate-900">{result.impact.customers}</span>
          </div>
        </div>
        
        {result.kitchens.length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Affected Locations:</div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              {result.kitchens.map(k => (
                <span key={k.id} className="bg-slate-100 px-2 py-1 border border-slate-200">{k.name} ({k.city})</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
