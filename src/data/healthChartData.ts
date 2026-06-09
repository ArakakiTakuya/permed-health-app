import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import type { WeeklyStrainPoint, WhoopRecoveryMetrics } from '@/src/services/whoopApi';

export type BarChartPoint = {
  label: string;
  value: number | null;
};

export function toWeeklyStrainChartData(weeklyStrain: WeeklyStrainPoint[]): BarChartPoint[] {
  return weeklyStrain.map((item) => ({
    label: item.label,
    value: item.strain ?? null,
  }));
}

export function hasWhoopData(dashboard: WhoopRecoveryMetrics) {
  return typeof dashboard.score === 'number' || typeof dashboard.hrvMs === 'number';
}

export function hasWithingsData(dashboard: WithingsDashboardMetrics) {
  return typeof dashboard.sleepScore === 'number' || typeof dashboard.weightKg === 'number';
}
