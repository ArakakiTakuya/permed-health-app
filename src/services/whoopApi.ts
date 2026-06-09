import { apiFetch } from '@/src/services/apiClient';
import { whoopAppRedirectUri } from '@/src/services/whoopAuth';

type WhoopConnectSessionResponse = {
  url: string;
};

type LatestWhoopRecoveryResponse = {
  cycle?: unknown;
  recovery?: unknown;
  sleep?: unknown;
  weeklyStrain?: unknown;
  data?: unknown;
  score?: unknown;
  hrvMs?: unknown;
  restingHeartRate?: unknown;
  respiratoryRate?: unknown;
};

export type WeeklyStrainPoint = {
  date: string;
  label: string;
  strain?: number | null;
};

export type WhoopRecoveryMetrics = {
  cycleStartAt?: string;
  recoveryDate?: string;
  score?: number;
  hrvMs?: number;
  restingHeartRate?: number;
  respiratoryRate?: number;
  spo2Percentage?: number;
  skinTempCelsius?: number;
  sleepScore?: number;
  sleepConsistencyPercentage?: number;
  sleepEfficiencyPercentage?: number;
  sleepStartAt?: string;
  sleepEndAt?: string;
  sleepStatus?: string;
  isNap?: boolean;
  totalInBedTimeMilli?: number;
  totalAwakeTimeMilli?: number;
  totalLightSleepTimeMilli?: number;
  totalSlowWaveSleepTimeMilli?: number;
  totalRemSleepTimeMilli?: number;
  disturbanceCount?: number;
  sleepNeedMilli?: number;
  sleepDebtMilli?: number;
  dayStrain?: number;
  caloriesBurned?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  status: string;
  weeklyStrain: WeeklyStrainPoint[];
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

export async function getLatestWhoopDashboard() {
  const response = await apiFetch('/api/whoop/dashboard/latest');
  const data = (await response.json()) as LatestWhoopRecoveryResponse;

  return normalizeRecovery(data);
}

export async function syncWhoopData() {
  await apiFetch('/api/whoop/sync', {
    method: 'POST',
  });
}

function normalizeRecovery(payload: unknown): WhoopRecoveryMetrics {
  const payloadRecord = asRecord(payload);
  const record = getRecoveryRecord(payloadRecord);
  const cycleRecord = asRecord(payloadRecord.cycle);
  const sleepRecord = asRecord(payloadRecord.sleep);
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
    cycleStartAt: getString(cycleRecord.startAt) ?? getString(cycleRecord.start_at),
    recoveryDate:
      getString(recoveryRecord.date) ??
      getString(recoveryRecord.createdAt) ??
      getString(recoveryRecord.created_at),
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
      getNumber(sleepRecord.respiratoryRate) ??
      getNumber(sleepRecord.respiratory_rate) ??
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
    sleepScore:
      getNumber(sleepRecord.sleepPerformancePercentage) ??
      getNumber(sleepRecord.sleep_performance_percentage),
    sleepConsistencyPercentage:
      getNumber(sleepRecord.sleepConsistencyPercentage) ??
      getNumber(sleepRecord.sleep_consistency_percentage),
    sleepEfficiencyPercentage:
      getNumber(sleepRecord.sleepEfficiencyPercentage) ??
      getNumber(sleepRecord.sleep_efficiency_percentage),
    sleepStartAt: getString(sleepRecord.startAt) ?? getString(sleepRecord.start_at),
    sleepEndAt: getString(sleepRecord.endAt) ?? getString(sleepRecord.end_at),
    sleepStatus: getString(sleepRecord.status),
    isNap: getBoolean(sleepRecord.nap),
    totalInBedTimeMilli: getNumber(sleepRecord.totalInBedTimeMilli),
    totalAwakeTimeMilli: getNumber(sleepRecord.totalAwakeTimeMilli),
    totalLightSleepTimeMilli: getNumber(sleepRecord.totalLightSleepTimeMilli),
    totalSlowWaveSleepTimeMilli: getNumber(sleepRecord.totalSlowWaveSleepTimeMilli),
    totalRemSleepTimeMilli: getNumber(sleepRecord.totalRemSleepTimeMilli),
    disturbanceCount: getNumber(sleepRecord.disturbanceCount),
    sleepNeedMilli: sumNumbers(
      sleepRecord.sleepNeedBaselineMilli,
      sleepRecord.sleepNeedFromDebtMilli,
      sleepRecord.sleepNeedFromRecentStrainMilli,
      sleepRecord.sleepNeedFromRecentNapMilli,
    ),
    sleepDebtMilli: getNumber(sleepRecord.sleepNeedFromDebtMilli),
    dayStrain: getNumber(cycleRecord.strain),
    caloriesBurned: toCalories(getNumber(cycleRecord.kilojoule)),
    averageHeartRate:
      getNumber(cycleRecord.averageHeartRate) ??
      getNumber(cycleRecord.average_heart_rate),
    maxHeartRate: getNumber(cycleRecord.maxHeartRate) ?? getNumber(cycleRecord.max_heart_rate),
    status: getRecoveryStatus(recoveryRecord, scoreRecord, recoveryScore),
    weeklyStrain: normalizeWeeklyStrain(payloadRecord.weeklyStrain),
  };
}

function normalizeWeeklyStrain(value: unknown): WeeklyStrainPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<WeeklyStrainPoint[]>((points, item) => {
    const record = asRecord(item);
    const label = getString(record.label);
    const date = getString(record.date);

    if (!label || !date) {
      return points;
    }

    points.push({
      date,
      label,
      strain: getNumber(record.strain) ?? null,
    });

    return points;
  }, []);
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

function getBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function toCalories(kilojoule: number | undefined) {
  return typeof kilojoule === 'number' ? kilojoule / 4.184 : undefined;
}

function sumNumbers(...values: unknown[]) {
  const numbers = values.map(getNumber);

  if (numbers.every((value) => typeof value !== 'number')) {
    return undefined;
  }

  return numbers.reduce<number>((total, value) => total + (value ?? 0), 0);
}
