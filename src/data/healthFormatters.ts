export function roundScore(value: number | undefined) {
  return typeof value === 'number' ? Math.round(value) : undefined;
}

export function formatScore(value: number | undefined) {
  return typeof value === 'number' ? Math.round(value) : '--';
}

export function formatMetric(value: number | undefined, unit: string, fractionDigits = 0) {
  if (typeof value !== 'number') {
    return '--';
  }

  return [value.toFixed(fractionDigits), unit].filter(Boolean).join(' ');
}

export function formatMetricValue(value: number | undefined, fractionDigits = 0) {
  return typeof value === 'number' ? value.toFixed(fractionDigits) : '--';
}

export function formatSecondsAsDuration(value: number | undefined) {
  if (typeof value !== 'number') {
    return '--';
  }

  const durationMinutes = Math.round(value / 60);
  return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
}

export function formatMillisecondsAsDuration(value: number | undefined) {
  if (typeof value !== 'number') {
    return '--';
  }

  const durationMinutes = Math.round(value / (60 * 1000));
  return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
}

export function formatSeconds(value: number | undefined) {
  if (typeof value !== 'number') {
    return '--';
  }

  return `${Math.round(value / 60)} min`;
}

export function formatCount(value: number | undefined) {
  return typeof value === 'number' ? `${Math.round(value)}` : '--';
}

export function getScoreLabel(value: number | undefined) {
  if (typeof value !== 'number') {
    return '--';
  }

  return value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : 'Low';
}
