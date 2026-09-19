import { useState } from 'react';
import type { InvestigationResponse, SimulateContainmentResponse } from '../api/types';
import { simulateContainment } from '../api/simulation';

interface Props {
  result: InvestigationResponse | null;
  onApplyRecall: () => Promise<void>;
  isRecalling: boolean;
  recallError: string | null;
  onSimulationUpdate: (sim: SimulateContainmentResponse | null) => void;
}

export const RecallSimulator: React.FC<Props> = ({ result, onApplyRecall, isRecalling, recallError, onSimulationUpdate }) => {
  const [selectedKitchen, setSelectedKitchen] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  if (!result || !result.batch) return null;

  const isContaminated = result.batch.status === 'CONTAMINATED';

  const handleSimulate = async () => {
    if (!selectedKitchen) return;
    setIsSimulating(true);
    setSimError(null);
    try {
      const simResult = await simulateContainment({ batch_id: result.batch!.id, kitchen_id: selectedKitchen });
      onSimulationUpdate(simResult);
    } catch (err: any) {
      setSimError(err.message || 'Simulation failed');
      onSimulationUpdate(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSim = () => {
    setSelectedKitchen('');
    onSimulationUpdate(null);
  };

  return (
    <section className="bg-surface border border-ui-border p-6 mt-12">
      <h2 className="text-[10px] font-bold text-muted tracking-widest uppercase mb-4 border-b border-ui-border pb-2">
        {isContaminated ? 'Post-Incident State' : 'Operational Simulation'}
      </h2>
      
      {!isContaminated ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-ink uppercase tracking-widest">Counterfactual Containment</h3>
            <span className="text-[10px] font-bold text-simulation bg-simulation-soft px-2 py-1 uppercase tracking-widest border border-simulation">
              SIMULATION — READ ONLY
            </span>
          </div>
          
          <div className="mb-8 border border-ui-border bg-canvas p-4">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Simulate Containment At Kitchen</label>
            <div className="flex gap-3">
              <select 
                value={selectedKitchen}
                onChange={(e) => setSelectedKitchen(e.target.value)}
                className="flex-1 bg-surface border border-ui-border px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-simulation rounded-none font-mono uppercase"
              >
                <option value="">Select a Kitchen...</option>
                {result.kitchens.map(k => (
                  <option key={k.id} value={k.id}>{k.name} ({k.id})</option>
                ))}
              </select>
              <button 
                onClick={handleSimulate}
                disabled={!selectedKitchen || isSimulating}
                className="bg-ink hover:bg-muted disabled:opacity-50 text-white px-6 font-bold text-[10px] tracking-widest uppercase transition-colors"
              >
                Simulate
              </button>
              <button 
                onClick={handleResetSim}
                className="bg-ui-border text-ink px-4 font-bold text-[10px] tracking-widest uppercase hover:bg-muted hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>
            {simError && <div className="text-[10px] text-critical mt-3 font-bold font-mono tracking-widest uppercase">{simError}</div>}
          </div>

          <div className="border-t border-ui-border pt-8">
            <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-6">Ready to Execute Recall</h3>
            <button 
              onClick={onApplyRecall}
              disabled={isRecalling}
              className="bg-critical hover:bg-maroon disabled:opacity-50 text-white px-6 py-4 font-bold tracking-widest uppercase text-xs transition-colors rounded-none w-full border-2 border-transparent"
            >
              {isRecalling ? 'EXECUTING RECALL...' : 'APPLY RECALL'}
            </button>
          </div>
          {recallError && (
            <div className="mt-4 text-[10px] text-critical font-bold font-mono tracking-widest uppercase">
              {recallError}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-canvas border border-ui-border mt-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-verified animate-pulse"></div>
            <div className="text-[10px] font-bold text-verified uppercase tracking-widest">RECALL VERIFIED</div>
          </div>
          <div className="text-4xl font-bold text-ink mb-4 font-mono">{result.batch.id}</div>
          <div className="text-xs font-bold text-critical uppercase tracking-widest mb-8 border border-critical inline-block px-4 py-1">
            CONTAMINATED
          </div>
          <div className="block">
            <div className="text-[10px] font-bold text-verified bg-verified-soft inline-block px-6 py-2 uppercase tracking-widest border border-verified">
              ✓ VERIFIED FROM LIVE NEO4J GRAPH
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
