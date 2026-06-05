export type WithingsDashboardMetrics = {
  weightKg?: number;
  bmi?: number;
  bodyFatPercentage?: number;
  fatMassKg?: number;
  muscleMassKg?: number;
  boneMassKg?: number;
  hydrationKg?: number;
  waterPercentage?: number;
  visceralFatLevel?: number;
  proteinPercentage?: number;
  metabolicAge?: number;
  bmrKcal?: number;
  bedtimeAt?: string;
  wakeTimeAt?: string;
  latencySeconds?: number;
  snoringSeconds?: number;
  interruptions?: number;
  apneaIndex?: number;
  averageNightHeartRate?: number;
  sleepDate?: string;
  totalSleepSeconds?: number;
  deepSleepSeconds?: number;
  remSleepSeconds?: number;
  lightSleepSeconds?: number;
  sleepScore?: number;
};

export function normalizeWithingsDashboard(bodyPayload: unknown, sleepPayload: unknown) {
  return {
    ...normalizeBody(bodyPayload),
    ...normalizeSleep(sleepPayload),
  };
}

function normalizeBody(payload: unknown): WithingsDashboardMetrics {
  const record = getDataRecord(payload);
  const measurements = asRecord(record.measurements);

  return {
    weightKg:
      getNumber(record.weightKg) ??
      getNumber(record.weight) ??
      getNumber(measurements.weightKg) ??
      getNumber(measurements.weight),
    bmi: getNumber(record.bmi) ?? getNumber(measurements.bmi),
    bodyFatPercentage:
      getNumber(record.bodyFatPercentage) ??
      getNumber(record.bodyFat) ??
      getNumber(measurements.bodyFatPercentage) ??
      getNumber(measurements.bodyFat),
    fatMassKg:
      getNumber(record.fatMassKg) ??
      getNumber(record.fatMassWeight) ??
      getNumber(measurements.fatMassKg) ??
      getNumber(measurements.fatMassWeight),
    muscleMassKg:
      getNumber(record.muscleMassKg) ??
      getNumber(record.muscleMass) ??
      getNumber(measurements.muscleMassKg) ??
      getNumber(measurements.muscleMass),
    boneMassKg:
      getNumber(record.boneMassKg) ??
      getNumber(record.boneMass) ??
      getNumber(measurements.boneMassKg) ??
      getNumber(measurements.boneMass),
    hydrationKg:
      getNumber(record.hydrationKg) ??
      getNumber(record.hydration) ??
      getNumber(measurements.hydrationKg) ??
      getNumber(measurements.hydration),
    waterPercentage:
      getNumber(record.waterPercentage) ??
      getNumber(record.water) ??
      getNumber(measurements.waterPercentage) ??
      getNumber(measurements.water),
    visceralFatLevel:
      getNumber(record.visceralFatLevel) ??
      getNumber(record.visceralFat) ??
      getNumber(measurements.visceralFatLevel) ??
      getNumber(measurements.visceralFat),
    proteinPercentage:
      getNumber(record.proteinPercentage) ??
      getNumber(record.protein) ??
      getNumber(measurements.proteinPercentage) ??
      getNumber(measurements.protein),
    metabolicAge:
      getNumber(record.metabolicAge) ??
      getNumber(measurements.metabolicAge),
    bmrKcal:
      getNumber(record.bmrKcal) ??
      getNumber(record.bmr) ??
      getNumber(measurements.bmrKcal) ??
      getNumber(measurements.bmr),
  };
}

function normalizeSleep(payload: unknown): WithingsDashboardMetrics {
  const record = getDataRecord(payload, 'sleep');

  return {
    sleepDate:
      getString(record.sleepDate) ??
      getString(record.sleep_date),
    bedtimeAt:
      getString(record.bedtimeAt) ??
      getString(record.bedtime) ??
      getString(record.startAt) ??
      getString(record.start_at),
    wakeTimeAt:
      getString(record.wakeTimeAt) ??
      getString(record.wakeTime) ??
      getString(record.endAt) ??
      getString(record.end_at),
    latencySeconds:
      getNumber(record.sleepLatencySeconds) ??
      getNumber(record.sleep_latency_seconds) ??
      getNumber(record.latencySeconds) ??
      getNumber(record.latency),
    snoringSeconds:
      getNumber(record.snoringSeconds) ??
      getNumber(record.snoring_seconds),
    interruptions:
      getNumber(record.interruptions) ??
      getNumber(record.wakeupCount) ??
      getNumber(record.wakeup_count),
    apneaIndex:
      getNumber(record.apneaHypopneaIndex) ??
      getNumber(record.apnea_hypopnea_index) ??
      getNumber(record.apneaIndex) ??
      getNumber(record.apnea_index),
    averageNightHeartRate:
      getNumber(record.hrAverage) ??
      getNumber(record.hr_average) ??
      getNumber(record.averageNightHeartRate) ??
      getNumber(record.avgNightHr) ??
      getNumber(record.average_heart_rate),
    totalSleepSeconds:
      getNumber(record.totalSleepSeconds) ??
      getNumber(record.totalSleepTime) ??
      getNumber(record.total_sleep_seconds) ??
      getNumber(record.total_sleep_time),
    deepSleepSeconds:
      getNumber(record.deepSleepSeconds) ??
      getNumber(record.deepSleepDuration) ??
      getNumber(record.deep_sleep_seconds) ??
      getNumber(record.deep_sleep_duration),
    remSleepSeconds:
      getNumber(record.remSleepSeconds) ??
      getNumber(record.remSleepDuration) ??
      getNumber(record.rem_sleep_seconds) ??
      getNumber(record.rem_sleep_duration),
    lightSleepSeconds:
      getNumber(record.lightSleepSeconds) ??
      getNumber(record.lightSleepDuration) ??
      getNumber(record.light_sleep_seconds) ??
      getNumber(record.light_sleep_duration),
    sleepScore:
      getNumber(record.sleepScore) ??
      getNumber(record.sleep_score),
  };
}

function getDataRecord(payload: unknown, nestedKey?: string) {
  const record = asRecord(payload);

  if (nestedKey) {
    const nestedRecord = asRecord(record[nestedKey]);

    if (Object.keys(nestedRecord).length) {
      return nestedRecord;
    }
  }

  const dataRecord = asRecord(record.data);

  if (Object.keys(dataRecord).length) {
    return dataRecord;
  }

  return record;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
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
