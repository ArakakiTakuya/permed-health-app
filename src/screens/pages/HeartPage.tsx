import { View } from 'react-native';

import { Card, MetricCard, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { trendData } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function HeartPage() {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.rose} title="Heart" subtitle="WHOOP + Withings" />
      <View style={styles.grid2}>
        <MetricCard label="Resting HR" value="52" unit="bpm" color={colors.rose} />
        <MetricCard label="HRV (RMSSD)" value="68" unit="ms" color={colors.primary} />
        <MetricCard label="Blood Oxygen" value="98" unit="%" color={colors.sky} />
        <MetricCard label="Resp. Rate" value="14.2" unit="rpm" color={colors.violet} />
      </View>
      <Card accent={colors.rose}>
        <Label color={colors.rose}>24-Hour Heart Rate</Label>
        <LineChart data={trendData.heart} color={colors.rose} min={45} max={95} tall />
      </Card>
      <StatsCard
        title="WHOOP Cardiac Metrics"
        rows={[
          ['HRV (RMSSD)', '68 ms', colors.primary],
          ['Resting HR', '52 bpm', colors.rose],
          ['Max HR (24h)', '148 bpm', colors.amber],
          ['Min HR (24h)', '48 bpm', colors.sky],
          ['Avg HR', '67 bpm', colors.text],
        ]}
      />
      <StatsCard
        title="Withings Cardiac"
        rows={[
          ['Pulse Wave Velocity', '6.8 m/s', colors.primary],
          ['Vascular Age', '29 yrs', colors.sage],
          ['Standing HR', '72 bpm', colors.amber],
          ['ECG Status', 'Sinus rhythm', colors.sage],
        ]}
      />
    </View>
  );
}
