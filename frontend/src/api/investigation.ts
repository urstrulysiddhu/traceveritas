import type { InvestigationRequest, InvestigationResponse } from './types';

export async function investigateBatch(request: InvestigationRequest): Promise<InvestigationResponse> {
  try {
    const response = await fetch('/api/investigate/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Batch not found`);
      } else if (response.status === 503) {
        throw new Error('Unable to connect to TraceVeritas backend');
      }
      throw new Error('Investigation failed. Please retry.');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Investigation failed. Please retry.');
  }
}
