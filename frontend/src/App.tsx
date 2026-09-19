import { useState } from 'react';
import { Layout } from './components/Layout';
import { InvestigationConsole } from './components/InvestigationConsole';
import { ImpactSummary } from './components/ImpactSummary';
import { ImpactGraph } from './components/ImpactGraph';
import { RecallSimulator } from './components/RecallSimulator';
import { ViewCypher } from './components/ViewCypher';
import { investigateBatch } from './api/investigation';
import { recallBatch } from './api/recall';
import type { InvestigationResponse } from './api/types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvestigationResponse | null>(null);

  const [isRecalling, setIsRecalling] = useState(false);
  const [recallError, setRecallError] = useState<string | null>(null);

  const handleInvestigate = async (batchId: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setRecallError(null);

    try {
      const data = await investigateBatch({ batch_id: batchId });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Investigation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyRecall = async () => {
    if (!result || !result.batch) return;
    
    setIsRecalling(true);
    setRecallError(null);

    try {
      // 1. Mutate batch status
      await recallBatch({ batch_id: result.batch.id });
      // 2. Re-run investigation to verify live graph state
      const data = await investigateBatch({ batch_id: result.batch.id });
      setResult(data);
    } catch (err: any) {
      setRecallError(err.message || 'Recall mutation failed');
    } finally {
      setIsRecalling(false);
    }
  };

  return (
    <Layout>
      <div className="mb-12">
        <InvestigationConsole 
          onInvestigate={handleInvestigate} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>

      {result && (
        <div className="border-t border-slate-200 pt-12 pb-24">
          <ImpactSummary result={result} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <div>
              <ImpactGraph result={result} />
            </div>
            <div>
              <RecallSimulator 
                result={result} 
                onApplyRecall={handleApplyRecall}
                isRecalling={isRecalling}
                recallError={recallError}
              />
              <ViewCypher result={result} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
