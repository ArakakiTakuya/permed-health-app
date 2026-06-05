import { View } from 'react-native';

import { Card, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label, Legend } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { formatMetric, formatMetricValue } from '@/src/data/healthFormatters';
import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function BodyPage({
  dashboard,
}: {
  dashboard: WithingsDashboardMetrics;
}) {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.sky} title="Body Composition" subtitle="Withings Body Scan · Today" />
      <View style={styles.grid2}>
        <MetricCard label="Weight" value={formatMetricValue(dashboard.weightKg, 1)} unit="kg" color={colors.sky} />
        <MetricCard label="BMI" value={formatMetricValue(dashboard.bmi, 1)} color={colors.primary} />
        <MetricCard label="Body Fat" value={formatMetricValue(dashboard.bodyFatPercentage, 1)} unit="%" color={colors.rose} />
        <MetricCard label="Muscle Mass" value={formatMetricValue(dashboard.muscleMassKg, 1)} unit="kg" color={colors.sage} />
      </View>
      <Card accent={colors.sky}>
        <Label color={colors.sky}>7-Day Weight Trend</Label>
        <LineChart data={[]} color={colors.sky} min={67} max={69} tall />
      </Card>
      <Card accent={colors.primary}>
        <Label color={colors.primary}>Withings Body Composition</Label>
        <View style={styles.compositionRow}>
          <View style={styles.legendList}>
            <Legend label="Muscle" value={formatMetric(dashboard.muscleMassKg, 'kg', 1)} color={colors.primary} />
            <Legend label="Fat" value={formatMetric(dashboard.fatMassKg, 'kg', 1)} color={colors.rose} />
            <Legend label="Bone" value={formatMetric(dashboard.boneMassKg, 'kg', 1)} color={colors.amber} />
            <Legend label="Water" value={formatMetric(dashboard.hydrationKg, 'kg', 1)} color={colors.sky} />
          </View>
        </View>
      </Card>
      <StatsCard
        title="Withings Metrics"
        rows={[
          ['Visceral Fat', formatLevel(dashboard.visceralFatLevel), colors.sage],
          ['Bone Mass', formatMetric(dashboard.boneMassKg, 'kg', 1), colors.amber],
          ['Water %', formatMetric(dashboard.waterPercentage, '%', 1), colors.sky],
          ['Protein %', formatMetric(dashboard.proteinPercentage, '%', 1), colors.primary],
          ['Metabolic Age', formatMetric(dashboard.metabolicAge, 'yrs'), colors.violet],
          ['BMR', formatMetric(dashboard.bmrKcal, 'kcal'), colors.amber],
        ]}
      />
    </View>
  );
}

function formatLevel(value: number | undefined) {
  return typeof value === 'number' ? `Level ${Math.round(value)}` : '--';
}
