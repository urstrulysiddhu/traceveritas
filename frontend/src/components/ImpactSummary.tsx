import type { InvestigationResponse, SimulateContainmentResponse } from '../api/types';

interface Props {
  result: InvestigationResponse;
  simResult?: SimulateContainmentResponse | null;
}

export const ImpactSummary: React.FC<Props> = ({ result, simResult }) => {
  if (!result.batch) return null;

  return (
    <section>
      <div className="mb-12">
        <h2 className="text-[10px] font-bold text-muted tracking-widest uppercase mb-4 pb-2 border-b border-ui-border">Investigation Target</h2>
        <div className="flex items-baseline gap-4">
          <div className="text-4xl font-bold font-mono text-ink">{result.batch.id}</div>
          <div className="text-sm text-ink font-medium uppercase tracking-wider">{result.batch.ingredient}</div>
        </div>
        <div className="text-[10px] font-mono text-muted flex gap-6 mt-3 uppercase tracking-widest">
          <div><span className="font-bold text-ink">RCVD:</span> {result.batch.received_date}</div>
          <div><span className="font-bold text-ink">EXP:</span> {result.batch.expiry_date}</div>
          <div>
            <span className="font-bold text-ink">STATUS: </span> 
            <span className={result.batch.status === 'SAFE' ? 'text-verified font-bold' : 'text-critical font-bold'}>
              {result.batch.status}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-[10px] font-bold text-muted tracking-widest uppercase mb-6 border-b border-ui-border pb-2">
        {simResult ? (
          <div className="flex gap-12">
            <span className="text-ink">Live Impact</span>
            <span className="text-simulation">Simulated Remaining (Read Only)</span>
          </div>
        ) : 'Downstream Impact'}
      </h3>
      
      <div className="flex gap-12 text-ink mb-12">
        <div>
          <div className="font-bold font-mono text-6xl mb-2 flex items-baseline gap-4">
            {simResult && <span className="text-3xl text-muted line-through">{String(result.impact.kitchens).padStart(2, '0')}</span>}
            <span className={simResult ? 'text-simulation' : ''}>
              {String(simResult ? simResult.remaining.counts.kitchens : result.impact.kitchens).padStart(2, '0')}
            </span>
          </div> 
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted">Kitchens</div>
        </div>
        <div>
          <div className="font-bold font-mono text-6xl mb-2 flex items-baseline gap-4">
            {simResult && <span className="text-3xl text-muted line-through">{String(result.impact.dishes).padStart(2, '0')}</span>}
            <span className={simResult ? 'text-simulation' : ''}>
              {String(simResult ? simResult.remaining.counts.dishes : result.impact.dishes).padStart(2, '0')}
            </span>
          </div> 
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted">Dishes</div>
        </div>
        <div>
          <div className="font-bold font-mono text-6xl mb-2 flex items-baseline gap-4">
            {simResult && <span className="text-3xl text-muted line-through">{String(result.impact.orders).padStart(2, '0')}</span>}
            <span className={simResult ? 'text-simulation' : ''}>
              {String(simResult ? simResult.remaining.counts.orders : result.impact.orders).padStart(2, '0')}
            </span>
          </div> 
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted">Orders</div>
        </div>
        <div>
          <div className="font-bold font-mono text-6xl mb-2 flex items-baseline gap-4">
            {simResult && <span className="text-3xl text-muted line-through">{String(result.impact.customers).padStart(2, '0')}</span>}
            <span className={simResult ? 'text-simulation' : ''}>
              {String(simResult ? simResult.remaining.counts.customers : result.impact.customers).padStart(2, '0')}
            </span>
          </div> 
          <div className="text-[10px] font-bold tracking-widest uppercase text-muted">Customers</div>
        </div>
      </div>
      
      <div className="max-w-2xl">
        <h3 className="text-[10px] font-bold text-muted tracking-widest uppercase mb-4 border-b border-ui-border pb-2">Operational Actions Required</h3>
        <div className="space-y-3 text-xs text-ink font-mono uppercase tracking-wider bg-surface p-6 border border-ui-border">
          <div className="flex justify-between border-b border-ui-border pb-2">
            <span>Kitchens requiring operational review</span>
            <span className="font-bold">{simResult ? simResult.remaining.counts.kitchens : result.impact.kitchens}</span>
          </div>
          <div className="flex justify-between border-b border-ui-border pb-2">
            <span>Dishes requiring menu suppression</span>
            <span className="font-bold">{simResult ? simResult.remaining.counts.dishes : result.impact.dishes}</span>
          </div>
          <div className="flex justify-between border-b border-ui-border pb-2">
            <span>Customer orders potentially affected</span>
            <span className="font-bold">{simResult ? simResult.remaining.counts.orders : result.impact.orders}</span>
          </div>
          <div className="flex justify-between">
            <span>Customers requiring notification</span>
            <span className="font-bold">{simResult ? simResult.remaining.counts.customers : result.impact.customers}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
