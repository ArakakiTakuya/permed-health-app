import type { AppleHealthGlucosePoint, AppleHealthSnapshot } from '@/src/services/appleHealth';

const LOW_GLUCOSE_THRESHOLD = 70;
const HIGH_GLUCOSE_THRESHOLD = 140;

export type AppleHealthGlucoseStatus = 'low' | 'inRange' | 'high' | 'unknown';

export type AppleHealthGlucoseStats = {
  averageMgDl?: number;
  chartValues: number[];
  coefficientOfVariation?: number;
  estimatedA1c?: number;
  latestMeasuredAt?: string;
  latestMgDl?: number;
  peakMgDl?: number;
  standardDeviation?: number;
  timeAboveRangePercentage?: number;
  timeBelowRangePercentage?: number;
  timeInRangePercentage?: number;
};

export function getAppleHealthGlucoseStats(
  snapshot?: AppleHealthSnapshot | null,
): AppleHealthGlucoseStats {
  const samples = normalizeSamples(snapshot?.glucoseSamples ?? []);
  const values = samples.map((sample) => sample.valueMgDl);
  const latestSample = samples[samples.length - 1];

  if (!values.length) {
    return {
      chartValues: [],
      latestMgDl: snapshot?.bloodGlucoseMgDl,
    };
  }

  const averageMgDl = average(values);
  const standardDeviation = getStandardDeviation(values, averageMgDl);
  const timeBelowRangePercentage = getRangePercentage(values, (value) => value < LOW_GLUCOSE_THRESHOLD);
  const timeAboveRangePercentage = getRangePercentage(values, (value) => value > HIGH_GLUCOSE_THRESHOLD);
  const timeInRangePercentage = getRangePercentage(
    values,
    (value) => value >= LOW_GLUCOSE_THRESHOLD && value <= HIGH_GLUCOSE_THRESHOLD,
  );

  return {
    averageMgDl,
    chartValues: values.slice(-24),
    coefficientOfVariation: averageMgDl > 0 ? (standardDeviation / averageMgDl) * 100 : undefined,
    estimatedA1c: (averageMgDl + 46.7) / 28.7,
    latestMeasuredAt: latestSample?.measuredAt,
    latestMgDl: latestSample?.valueMgDl,
    peakMgDl: Math.max(...values),
    standardDeviation,
    timeAboveRangePercentage,
    timeBelowRangePercentage,
    timeInRangePercentage,
  };
}

export function getGlucoseStatus(value: number | undefined): AppleHealthGlucoseStatus {
  if (typeof value !== 'number') {
    return 'unknown';
  }

  if (value < LOW_GLUCOSE_THRESHOLD) {
    return 'low';
  }

  if (value > HIGH_GLUCOSE_THRESHOLD) {
    return 'high';
  }

  return 'inRange';
}

export function getGlucoseStatusLabel(value: number | undefined) {
  switch (getGlucoseStatus(value)) {
    case 'low':
      return 'Low';
    case 'high':
      return 'High';
    case 'inRange':
      return 'In range';
    case 'unknown':
      return '--';
  }
}

export function formatGlucoseValue(value: number | undefined) {
  return typeof value === 'number' ? `${Math.round(value)} mg/dL` : '--';
}

export function formatGlucosePercentage(value: number | undefined, fractionDigits = 0) {
  return typeof value === 'number' ? `${value.toFixed(fractionDigits)}%` : '--';
}

function normalizeSamples(samples: AppleHealthGlucosePoint[]) {
  return [...samples]
    .filter((sample) => typeof sample.valueMgDl === 'number' && Boolean(sample.measuredAt))
    .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getStandardDeviation(values: number[], mean: number) {
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}

function getRangePercentage(values: number[], predicate: (value: number) => boolean) {
  return (values.filter(predicate).length / values.length) * 100;
}
