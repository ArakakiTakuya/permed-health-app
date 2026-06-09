import { View } from 'react-native';

import { Card, CardMeta, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label, Range } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { formatDataWeekday } from '@/src/data/healthFormatters';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function GlucosePage() {
  const dataLabel = formatDataWeekday(undefined);

  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.amber} title="Glucose" subtitle="Abbott Lingo CGM" />
      <View style={styles.grid2}>
        <MetricCard label="Current" value="--" unit="mg/dL" color={colors.sage} pill="--" />
        <MetricCard label="Daily Avg" value="--" unit="mg/dL" color={colors.amber} pill="--" />
        <MetricCard label="Time in Range" value="--" unit="%" color={colors.primary} pill="--" />
        <MetricCard label="Est. A1C" value="--" unit="%" color={colors.violet} pill="--" />
      </View>
      <Card accent={colors.amber}>
        <Label color={colors.amber}>24-Hour Glucose Profile</Label>
        <CardMeta text={dataLabel} />
        <LineChart data={[]} color={colors.amber} min={60} max={170} tall />
      </Card>
      <Card>
        <Label>Time Distribution</Label>
        <CardMeta text={dataLabel} />
        <Range label="Time in Range (70-140)" value="--" pct={0} color={colors.sage} bg={colors.sageLight} />
        <Range label="Below Range (<70)" value="--" pct={0} color={colors.rose} bg={colors.roseLight} />
        <Range label="Above Range (>140)" value="--" pct={0} color={colors.amber} bg={colors.amberLight} />
      </Card>
      <StatsCard
        meta={dataLabel}
        title="CGM Insights"
        rows={[
          ['Glucose Variability (CV)', '--', colors.sage],
          ['Mean Glucose', '--', colors.amber],
          ['Standard Deviation', '--', colors.text],
          ['Peak Glucose', '--', colors.rose],
          ['Est. HbA1c', '--', colors.violet],
        ]}
      />
    </View>
  );
}
