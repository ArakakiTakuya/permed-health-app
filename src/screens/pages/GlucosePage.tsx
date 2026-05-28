import { View } from 'react-native';

import { Card, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label, Range } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { trendData } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function GlucosePage() {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.amber} title="Glucose" subtitle="Abbott Lingo CGM · Today" />
      <View style={styles.grid2}>
        <MetricCard label="Current" value="96" unit="mg/dL" color={colors.sage} pill="In Range" />
        <MetricCard label="Daily Avg" value="104" unit="mg/dL" color={colors.amber} pill="Optimal" />
        <MetricCard label="Time in Range" value="91" unit="%" color={colors.primary} pill="Excellent" />
        <MetricCard label="Est. A1C" value="5.1" unit="%" color={colors.violet} pill="Normal" />
      </View>
      <Card accent={colors.amber}>
        <Label color={colors.amber}>24-Hour Glucose Profile</Label>
        <LineChart data={trendData.glucose} color={colors.amber} min={60} max={170} tall />
      </Card>
      <Card>
        <Label>Time Distribution</Label>
        <Range label="Time in Range (70-140)" value="91%" pct={91} color={colors.sage} bg={colors.sageLight} />
        <Range label="Below Range (<70)" value="2%" pct={2} color={colors.rose} bg={colors.roseLight} />
        <Range label="Above Range (>140)" value="7%" pct={7} color={colors.amber} bg={colors.amberLight} />
      </Card>
      <StatsCard
        title="CGM Insights"
        rows={[
          ['Glucose Variability (CV)', '18.4%', colors.sage],
          ['Mean Glucose', '104 mg/dL', colors.amber],
          ['Standard Deviation', '19.2', colors.text],
          ['Peak Glucose', '145 mg/dL', colors.rose],
          ['Est. HbA1c', '5.1%', colors.violet],
        ]}
      />
    </View>
  );
}
