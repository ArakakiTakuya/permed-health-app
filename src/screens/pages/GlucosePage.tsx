import { View } from 'react-native';

import { Card, CardMeta, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { getGlucoseStatusColor } from '@/src/components/dashboard/glucoseDisplay';
import { Label, Range } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import {
  formatGlucosePercentage,
  formatGlucoseValue,
  getAppleHealthGlucoseStats,
  getGlucoseStatusLabel,
} from '@/src/data/appleHealthGlucose';
import {
  formatDataWeekday,
  formatMetricValue,
} from '@/src/data/healthFormatters';
import type { AppleHealthSnapshot } from '@/src/services/appleHealth';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function GlucosePage({
  appleHealthSnapshot,
}: {
  appleHealthSnapshot?: AppleHealthSnapshot | null;
}) {
  const glucoseStats = getAppleHealthGlucoseStats(appleHealthSnapshot);
  const dataLabel = formatDataWeekday(glucoseStats.latestMeasuredAt);

  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.amber} title="Glucose" subtitle="Apple Health · Lingo CGM" />
      <View style={styles.grid2}>
        <MetricCard
          label="Current"
          value={formatMetricValue(glucoseStats.latestMgDl)}
          unit="mg/dL"
          color={getGlucoseStatusColor(glucoseStats.latestMgDl)}
          pill={getGlucoseStatusLabel(glucoseStats.latestMgDl)}
        />
        <MetricCard
          label="24h Avg"
          value={formatMetricValue(glucoseStats.averageMgDl)}
          unit="mg/dL"
          color={colors.amber}
          pill="Apple Health"
        />
        <MetricCard
          label="Time in Range"
          value={formatMetricValue(glucoseStats.timeInRangePercentage)}
          unit="%"
          color={colors.primary}
          pill="70-140"
        />
        <MetricCard
          label="Est. A1C"
          value={formatMetricValue(glucoseStats.estimatedA1c, 1)}
          unit="%"
          color={colors.violet}
          pill="Estimated"
        />
      </View>
      <Card accent={colors.amber}>
        <Label color={colors.amber}>24-Hour Glucose Profile</Label>
        <CardMeta text={dataLabel} />
        <LineChart data={glucoseStats.chartValues} color={colors.amber} min={60} max={180} tall />
      </Card>
      <Card>
        <Label>Time Distribution</Label>
        <CardMeta text={dataLabel} />
        <Range
          label="Time in Range (70-140)"
          value={formatGlucosePercentage(glucoseStats.timeInRangePercentage)}
          pct={glucoseStats.timeInRangePercentage ?? 0}
          color={colors.sage}
          bg={colors.sageLight}
        />
        <Range
          label="Below Range (<70)"
          value={formatGlucosePercentage(glucoseStats.timeBelowRangePercentage)}
          pct={glucoseStats.timeBelowRangePercentage ?? 0}
          color={colors.rose}
          bg={colors.roseLight}
        />
        <Range
          label="Above Range (>140)"
          value={formatGlucosePercentage(glucoseStats.timeAboveRangePercentage)}
          pct={glucoseStats.timeAboveRangePercentage ?? 0}
          color={colors.amber}
          bg={colors.amberLight}
        />
      </Card>
      <StatsCard
        meta={dataLabel}
        title="CGM Insights"
        rows={[
          ['Glucose Variability (CV)', formatGlucosePercentage(glucoseStats.coefficientOfVariation), colors.sage],
          ['Mean Glucose', formatGlucoseValue(glucoseStats.averageMgDl), colors.amber],
          ['Standard Deviation', formatGlucoseValue(glucoseStats.standardDeviation), colors.text],
          ['Peak Glucose', formatGlucoseValue(glucoseStats.peakMgDl), colors.rose],
          ['Est. HbA1c', formatGlucosePercentage(glucoseStats.estimatedA1c, 1), colors.violet],
        ]}
      />
    </View>
  );
}
