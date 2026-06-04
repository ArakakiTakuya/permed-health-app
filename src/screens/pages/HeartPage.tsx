import { View } from 'react-native';

import { Card, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import type { WhoopRecoveryMetrics } from '@/src/services/whoopApi';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function HeartPage({ dashboard }: { dashboard: WhoopRecoveryMetrics }) {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.rose} title="Heart" subtitle="WHOOP + Withings" />
      <View style={styles.grid2}>
        <MetricCard label="Resting HR" value={formatValue(dashboard.restingHeartRate)} unit="bpm" color={colors.rose} />
        <MetricCard label="HRV (RMSSD)" value={formatValue(dashboard.hrvMs)} unit="ms" color={colors.primary} />
        <MetricCard label="Blood Oxygen" value={formatValue(dashboard.spo2Percentage)} unit="%" color={colors.sky} />
        <MetricCard label="Resp. Rate" value={formatValue(dashboard.respiratoryRate, 1)} unit="rpm" color={colors.violet} />
      </View>
      <Card accent={colors.rose}>
        <Label color={colors.rose}>24-Hour Heart Rate</Label>
        <LineChart data={[]} color={colors.rose} min={45} max={95} tall />
      </Card>
      <StatsCard
        title="WHOOP Cardiac Metrics"
        rows={[
          ['HRV (RMSSD)', formatMetric(dashboard.hrvMs, 'ms'), colors.primary],
          ['Resting HR', formatMetric(dashboard.restingHeartRate, 'bpm'), colors.rose],
          ['Max HR (24h)', formatMetric(dashboard.maxHeartRate, 'bpm'), colors.amber],
          ['Min HR (24h)', '--', colors.sky],
          ['Avg HR', formatMetric(dashboard.averageHeartRate, 'bpm'), colors.text],
        ]}
      />
      <StatsCard
        title="Withings Cardiac"
        rows={[
          ['Pulse Wave Velocity', '--', colors.primary],
          ['Vascular Age', '--', colors.sage],
          ['Standing HR', '--', colors.amber],
          ['ECG Status', '--', colors.sage],
        ]}
      />
    </View>
  );
}

function formatValue(value: number | undefined, fractionDigits = 0) {
  return typeof value === 'number' ? value.toFixed(fractionDigits) : '--';
}

function formatMetric(value: number | undefined, unit: string, fractionDigits = 0) {
  return typeof value === 'number' ? `${value.toFixed(fractionDigits)} ${unit}` : '--';
}
