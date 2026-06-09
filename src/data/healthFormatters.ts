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

export function formatPercentage(value: number | undefined) {
  return typeof value === 'number' ? `${Math.round(value)}%` : '--';
}

export function formatTime(value: string | undefined) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatTimeRange(startAt: string | undefined, endAt: string | undefined) {
  if (!startAt || !endAt) {
    return '--';
  }

  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

export function formatLastSyncedAt(value: Date | null | undefined) {
  if (!value) {
    return 'Last synced: --';
  }

  return `Last synced: ${value.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

export function getScoreLabel(value: number | undefined) {
  if (typeof value !== 'number') {
    return '--';
  }

  return value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : 'Low';
}

export function sumMilliseconds(...values: (number | undefined)[]) {
  if (values.every((value) => typeof value !== 'number')) {
    return undefined;
  }

  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}
