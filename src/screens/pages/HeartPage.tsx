import { View } from 'react-native';

import { Card, CardMeta, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { formatDataWeekday, formatLastSyncedAt, formatMetric, formatMetricValue } from '@/src/data/healthFormatters';
import type { WhoopRecoveryMetrics } from '@/src/services/whoopApi';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function HeartPage({
  dashboard,
  lastSyncedAt,
}: {
  dashboard: WhoopRecoveryMetrics;
  lastSyncedAt: Date | null;
}) {
  const dataLabel = formatDataWeekday(dashboard.cycleStartAt ?? dashboard.recoveryDate);

  return (
    <View style={styles.panel}>
      <SectionHeader
        color={colors.rose}
        title="Heart"
        subtitle={`WHOOP + Withings · ${formatLastSyncedAt(lastSyncedAt)}`}
      />
      <View style={styles.grid2}>
        <MetricCard label="Resting HR" value={formatMetricValue(dashboard.restingHeartRate)} unit="bpm" color={colors.rose} />
        <MetricCard label="HRV (RMSSD)" value={formatMetricValue(dashboard.hrvMs)} unit="ms" color={colors.primary} />
        <MetricCard label="Blood Oxygen" value={formatMetricValue(dashboard.spo2Percentage)} unit="%" color={colors.sky} />
        <MetricCard label="Resp. Rate" value={formatMetricValue(dashboard.respiratoryRate, 1)} unit="rpm" color={colors.violet} />
      </View>
      <Card accent={colors.rose}>
        <Label color={colors.rose}>24-Hour Heart Rate</Label>
        <CardMeta text={dataLabel} />
        <LineChart data={[]} color={colors.rose} min={45} max={95} tall />
      </Card>
      <StatsCard
        meta={dataLabel}
        title="WHOOP Cardiac Metrics"
        rows={[
          ['Average HR', formatMetric(dashboard.averageHeartRate, 'bpm'), colors.text],
          ['HRV (RMSSD)', formatMetric(dashboard.hrvMs, 'ms'), colors.primary],
          ['Resting HR', formatMetric(dashboard.restingHeartRate, 'bpm'), colors.rose],
          ['Blood Oxygen', formatMetric(dashboard.spo2Percentage, '%'), colors.sky],
          ['Max HR (24h)', formatMetric(dashboard.maxHeartRate, 'bpm'), colors.amber],
          ['Min HR (24h)', '--', colors.sky],
        ]}
      />
    </View>
  );
}
