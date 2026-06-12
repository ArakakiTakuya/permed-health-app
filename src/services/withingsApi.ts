import { ApiError, apiFetch } from '@/src/services/apiClient';
import { normalizeWithingsDashboard } from '@/src/data/withingsDashboard';
import { withingsAppRedirectUri } from '@/src/services/withingsAuth';

type WithingsAuthUrlResponse = {
  url: string;
};

export async function createWithingsConnectSession() {
  const returnTo = encodeURIComponent(withingsAppRedirectUri);
  const response = await apiFetch(`/api/withings/auth-url?returnTo=${returnTo}`);
  const data = (await response.json()) as WithingsAuthUrlResponse;

  if (!data.url) {
    throw new Error('Backend did not return a Withings authorization URL.');
  }

  return data.url;
}

export async function syncWithingsData() {
  await apiFetch('/api/withings/sync', {
    method: 'POST',
  });
}

export async function getLatestWithingsDashboard() {
  const [bodyResult, sleepResult] = await Promise.allSettled([
    apiFetch('/api/withings/body'),
    apiFetch('/api/withings/sleep'),
  ]);

  const [bodyData, sleepData] = await Promise.all([
    readOptionalJson(bodyResult),
    readOptionalJson(sleepResult),
  ]);

  return normalizeWithingsDashboard(bodyData, sleepData);
}

async function readOptionalJson(result: PromiseSettledResult<Response>) {
  if (result.status === 'rejected') {
    if (isAuthError(result.reason)) {
      throw result.reason;
    }

    return null;
  }

  return result.value.json();
}

function isAuthError(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}
