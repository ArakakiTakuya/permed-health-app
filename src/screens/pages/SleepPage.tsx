import { Text, View } from 'react-native';

import { Card, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label, SleepChip } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { trendData } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function SleepPage() {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.violet} title="Sleep" subtitle="Withings Sleep Analyzer + WHOOP · Last Night" />
      <View style={heroStyles.violetHero}>
        <View style={styles.splitHeader}>
          <View>
            <Text style={heroStyles.heroLabel}>TOTAL SLEEP</Text>
            <Text style={heroStyles.heroNumber}>6h 20m</Text>
            <Text style={heroStyles.heroText}>Sleep Score: <Text style={heroStyles.boldWhite}>78 / 100</Text></Text>
          </View>
          <View style={styles.rightMetric}>
            <Text style={heroStyles.microWhite}>11:14 PM - 6:58 AM</Text>
            <View style={heroStyles.whitePill}>
              <Text style={heroStyles.whitePillText}>91% Efficient</Text>
            </View>
          </View>
        </View>
        <View style={styles.grid4}>
          <SleepChip label="AWAKE" value="0:18" translucent />
          <SleepChip label="REM" value="1:22" translucent />
          <SleepChip label="LIGHT" value="3:06" translucent />
          <SleepChip label="DEEP" value="1:34" translucent />
        </View>
      </View>
      <Card accent={colors.violet}>
        <Label color={colors.violet}>Overnight Heart Rate</Label>
        <LineChart data={trendData.heart} color={colors.violet} min={45} max={95} tall />
      </Card>
      <StatsCard
        title="Withings Sleep Analyzer"
        rows={[
          ['Bedtime', '11:14 PM', colors.text],
          ['Wake Time', '6:58 AM', colors.text],
          ['Latency', '8 min', colors.sage],
          ['Snoring', 'None', colors.sage],
          ['Interruptions', '2', colors.amber],
          ['Apnea Index', '0.4 /hr', colors.sage],
        ]}
      />
      <StatsCard
        title="WHOOP Sleep Performance"
        rows={[
          ['Sleep Performance', '73%', colors.violet],
          ['Sleep Need', '7h 45m', colors.text],
          ['Sleep Debt', '1h 25m', colors.rose],
          ['Deep (SWS)', '1h 34m', colors.primary],
          ['Recovery Score', '84%', colors.primary],
        ]}
      />
    </View>
  );
}
