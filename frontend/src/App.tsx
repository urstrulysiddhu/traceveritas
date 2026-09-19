import { useState } from 'react';
import { Layout } from './components/Layout';
import { InvestigationConsole } from './components/InvestigationConsole';
import { ReverseTracePath } from './components/ReverseTracePath';
import { ImpactSummary } from './components/ImpactSummary';
import { ImpactGraph } from './components/ImpactGraph';
import { RecallSimulator } from './components/RecallSimulator';
import { ViewCypher } from './components/ViewCypher';
import { TraceAssist } from './components/TraceAssist';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { investigateBatch } from './api/investigation';
import { recallBatch } from './api/recall';
import { traceOrigin } from './api/trace';
import type { InvestigationResponse, TraceOriginResponse, SimulateContainmentResponse } from './api/types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [originResult, setOriginResult] = useState<TraceOriginResponse | null>(null);
  const [impactResult, setImpactResult] = useState<InvestigationResponse | null>(null);
  const [simResult, setSimResult] = useState<SimulateContainmentResponse | null>(null);

  const [isRecalling, setIsRecalling] = useState(false);
  const [recallError, setRecallError] = useState<string | null>(null);

  const handleInvestigate = async (entityType: string, entityId: string) => {
    setIsLoading(true);
    setError(null);
    setActiveType(entityType);
    setActiveId(entityId);
    setOriginResult(null);
    setImpactResult(null);
    setSimResult(null);
    setRecallError(null);

    try {
      if (entityType === 'Batch') {
        const data = await investigateBatch({ batch_id: entityId });
        setImpactResult(data);
      } else {
        const data = await traceOrigin({ entity_type: entityType, entity_id: entityId });
        setOriginResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Investigation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandImpact = async (batchId: string) => {
    setIsLoading(true);
    setError(null);
    setImpactResult(null);
    setSimResult(null);

    try {
      const data = await investigateBatch({ batch_id: batchId });
      setImpactResult(data);
    } catch (err: any) {
      setError(err.message || 'Investigation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyRecall = async () => {
    if (!impactResult || !impactResult.batch) return;
    
    setIsRecalling(true);
    setRecallError(null);

    try {
      await recallBatch({ batch_id: impactResult.batch.id });
      const data = await investigateBatch({ batch_id: impactResult.batch.id });
      setImpactResult(data);
      setSimResult(null);
    } catch (err: any) {
      setRecallError(err.message || 'Recall mutation failed');
    } finally {
      setIsRecalling(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />
      <div className="relative z-10">
        <Layout>
          <div className="mb-6">
            <InvestigationConsole 
              onInvestigate={handleInvestigate} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-12">
            <div className="space-y-12">
              {originResult && !impactResult && (
                <ReverseTracePath 
                  result={originResult} 
                  onExpandImpact={handleExpandImpact} 
                />
              )}

              {impactResult && (
                <div className="flex flex-col space-y-12">
                  <div className="h-[calc(100vh-280px)] min-h-[600px] border border-ui-border bg-surface shadow-xl">
                    <ImpactGraph result={impactResult} simResult={simResult} />
                  </div>

                  <div className="border-t border-ui-border pt-12">
                    <ImpactSummary result={impactResult} simResult={simResult} />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
                    <RecallSimulator 
                      result={impactResult} 
                      onApplyRecall={handleApplyRecall}
                      isRecalling={isRecalling}
                      recallError={recallError}
                      onSimulationUpdate={setSimResult}
                    />
                    <ViewCypher result={impactResult} />
                  </div>
                </div>
              )}
            </div>

            <div>
              {activeType && activeId && (
                <div className="sticky top-6">
                  <TraceAssist 
                    entityType={activeType}
                    entityId={activeId}
                    containmentKitchenId={simResult?.containment_kitchen_id}
                    isRecalled={impactResult?.batch?.status === 'CONTAMINATED'}
                  />
                </div>
              )}
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default App;
