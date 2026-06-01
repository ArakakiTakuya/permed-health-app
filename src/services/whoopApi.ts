import { apiFetch } from '@/src/services/apiClient';
import { whoopAppRedirectUri } from '@/src/services/whoopAuth';

type WhoopConnectSessionResponse = {
  url: string;
};

type LatestWhoopRecoveryResponse = {
  recovery?: unknown;
  data?: unknown;
  score?: unknown;
  hrvMs?: unknown;
  restingHeartRate?: unknown;
  respiratoryRate?: unknown;
};

export type WhoopRecoveryMetrics = {
  score?: number;
  hrvMs?: number;
  restingHeartRate?: number;
  respiratoryRate?: number;
  spo2Percentage?: number;
  skinTempCelsius?: number;
  status: string;
};

export async function createWhoopConnectSession() {
  const response = await apiFetch('/api/whoop/connect/session', {
    method: 'POST',
    body: JSON.stringify({
      returnTo: whoopAppRedirectUri,
    }),
  });
  const data = (await response.json()) as WhoopConnectSessionResponse;

  if (!data.url) {
    throw new Error('Backend did not return a WHOOP authorization URL.');
  }

  return data.url;
}

export async function getLatestWhoopRecovery() {
  const response = await apiFetch('/api/whoop/recovery/latest');
  const data = (await response.json()) as LatestWhoopRecoveryResponse;

  return normalizeRecovery(data.recovery ?? data.data ?? data);
}

export async function syncWhoopRecovery() {
  await apiFetch('/api/whoop/recovery/sync', {
    method: 'POST',
  });
}

function normalizeRecovery(payload: unknown): WhoopRecoveryMetrics {
  const payloadRecord = asRecord(payload);
  const record = getRecoveryRecord(payloadRecord);
  const rawRecord = asJsonRecord(record.raw);
  const recoveryRecord = {
    ...rawRecord,
    ...record,
  };
  const scoreRecord = {
    ...asRecord(rawRecord.score),
    ...asRecord(record.score),
  };
  const recoveryScore =
    getNumber(recoveryRecord.recoveryScore) ??
    getNumber(recoveryRecord.recovery_score) ??
    getNumber(recoveryRecord.score) ??
    getNumber(scoreRecord.recovery_score) ??
    getNumber(scoreRecord.recoveryScore);

  return {
    score: recoveryScore,
    hrvMs:
      getNumber(recoveryRecord.hrvMs) ??
      getNumber(recoveryRecord.hrv_ms) ??
      getNumber(recoveryRecord.hrvRmssdMilli) ??
      getNumber(scoreRecord.hrv_rmssd_milli),
    restingHeartRate:
      getNumber(recoveryRecord.restingHeartRate) ??
      getNumber(recoveryRecord.resting_heart_rate) ??
      getNumber(scoreRecord.resting_heart_rate),
    respiratoryRate:
      getNumber(recoveryRecord.respiratoryRate) ??
      getNumber(recoveryRecord.respiratory_rate) ??
      getNumber(scoreRecord.respiratory_rate),
    spo2Percentage:
      getNumber(recoveryRecord.spo2Percentage) ??
      getNumber(recoveryRecord.spo2_percentage) ??
      getNumber(scoreRecord.spo2_percentage),
    skinTempCelsius:
      getNumber(recoveryRecord.skinTempCelsius) ??
      getNumber(recoveryRecord.skin_temp_celsius) ??
      getNumber(scoreRecord.skin_temp_celsius),
    status: getRecoveryStatus(recoveryRecord, scoreRecord, recoveryScore),
  };
}

function getRecoveryRecord(record: Record<string, unknown>) {
  const nestedRecord = asRecord(record.recovery);

  if (Object.keys(nestedRecord).length) {
    return nestedRecord;
  }

  const dataRecord = asRecord(record.data);

  if (Object.keys(dataRecord).length) {
    return getRecoveryRecord(dataRecord);
  }

  return record;
}

function getRecoveryStatus(
  record: Record<string, unknown>,
  scoreRecord: Record<string, unknown>,
  recoveryScore: number | undefined,
) {
  const scoreState =
    getString(record.scoreState) ??
    getString(record.score_state) ??
    getString(scoreRecord.scoreState) ??
    getString(scoreRecord.score_state);

  if (scoreState === 'PENDING_SCORE') {
    return 'Pending';
  }

  if (scoreState === 'UNSCORABLE') {
    return 'Unavailable';
  }

  const explicitStatus = getString(record.status) ?? getString(scoreRecord.status);

  if (explicitStatus) {
    return explicitStatus;
  }

  if (typeof recoveryScore !== 'number') {
    return '--';
  }

  return recoveryScore >= 67 ? 'Excellent' : recoveryScore >= 34 ? 'Good' : 'Low';
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asJsonRecord(value: unknown) {
  if (typeof value !== 'string') {
    return asRecord(value);
  }

  try {
    return asRecord(JSON.parse(value));
  } catch {
    return {};
  }
}

function getNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function getString(value: unknown) {
  return typeof value === 'string' && value ? value : undefined;
}
