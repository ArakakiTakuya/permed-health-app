import { View } from 'react-native';

import { Card, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { CompositionDonut, LineChart } from '@/src/components/dashboard/charts';
import { Label, Legend } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { trendData } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function BodyPage() {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.sky} title="Body Composition" subtitle="Withings Body Scan · Today" />
      <View style={styles.grid2}>
        <MetricCard label="Weight" value="67.6" unit="kg" color={colors.sky} sub="-0.8 kg this week" />
        <MetricCard label="BMI" value="22.4" color={colors.primary} sub="Normal range" />
        <MetricCard label="Body Fat" value="18.2" unit="%" color={colors.rose} sub="Fitness range" />
        <MetricCard label="Muscle Mass" value="52.4" unit="kg" color={colors.sage} />
      </View>
      <Card accent={colors.sky}>
        <Label color={colors.sky}>7-Day Weight Trend</Label>
        <LineChart data={trendData.weight} color={colors.sky} min={67} max={69} tall />
      </Card>
      <Card accent={colors.primary}>
        <Label color={colors.primary}>Withings Body Composition</Label>
        <View style={styles.compositionRow}>
          <CompositionDonut />
          <View style={styles.legendList}>
            <Legend label="Muscle" value="52.4 kg" color={colors.primary} />
            <Legend label="Fat" value="12.3 kg" color={colors.rose} />
            <Legend label="Bone" value="3.1 kg" color={colors.amber} />
            <Legend label="Water" value="39.8 kg" color={colors.sky} />
          </View>
        </View>
      </Card>
      <StatsCard
        title="Withings Metrics"
        rows={[
          ['Visceral Fat', 'Level 6', colors.sage],
          ['Bone Mass', '3.1 kg', colors.amber],
          ['Water %', '59.3%', colors.sky],
          ['Protein %', '18.7%', colors.primary],
          ['Metabolic Age', '28 yrs', colors.violet],
          ['BMR', '1,524 kcal', colors.amber],
        ]}
      />
    </View>
  );
}
