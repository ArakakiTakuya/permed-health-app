import { Text, View } from 'react-native';

import { Card, ScoreCard } from '@/src/components/dashboard/cards';
import { LineChart, Ring, SleepDonut } from '@/src/components/dashboard/charts';
import {
  InfoBox,
  Label,
  MetricValue,
  Pill,
  SleepChip,
} from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { trendData } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { HeroCard } from '@/src/components/HeroCard';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';
import { widgetStyles } from '@/src/styles/widgetStyles';

export function OverviewPage() {
  return (
    <View style={styles.panel}>
      <HeroCard />
      <SectionHeader color={colors.primary} title="Daily Scores" subtitle="WHOOP, Withings, Lingo · Today" />
      <View style={styles.grid2}>
        <ScoreCard label="WHOOP" title="Recovery" score={84} color={colors.primary} pill="Excellent" />
        <ScoreCard label="Withings" title="Sleep Score" score={78} color={colors.violet} pill="Good" />
        <ScoreCard label="Lingo" title="Time in Range" score={91} color={colors.amber} pill="Excellent" />
        <ScoreCard label="Withings" title="Body Score" score={72} color={colors.sky} pill="Good" />
      </View>

      <Card accent={colors.amber}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.amber}>Lingo CGM · Now</Label>
            <MetricValue color={colors.amber} value="96" unit="mg/dL" />
            <Pill color={colors.sage} bg={colors.sageLight} text="In Range" />
          </View>
          <View style={styles.rightMetric}>
            <Text style={widgetStyles.microMuted}>Time in Range</Text>
            <Text style={[widgetStyles.largeNumber, { color: colors.sage }]}>91%</Text>
            <Text style={widgetStyles.microMuted}>Today</Text>
          </View>
        </View>
        <LineChart data={trendData.glucose} color={colors.amber} min={70} max={160} />
      </Card>

      <Card accent={colors.violet}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.violet}>Withings · Last Night</Label>
            <Text style={[widgetStyles.largeNumber, { color: colors.violet }]}>6h 20m</Text>
            <Text style={widgetStyles.bodyMuted}>Sleep Score: <Text style={widgetStyles.boldViolet}>78</Text></Text>
          </View>
          <SleepDonut />
        </View>
        <View style={styles.grid4}>
          <SleepChip label="AWAKE" value="0:18" color={colors.rose} />
          <SleepChip label="REM" value="1:22" color={colors.violet} />
          <SleepChip label="LIGHT" value="3:06" color={colors.sky} />
          <SleepChip label="DEEP" value="1:34" color={colors.primary} />
        </View>
      </Card>

      <Card accent={colors.rose}>
        <Label color={colors.rose}>WHOOP · Recovery</Label>
        <View style={styles.ringRow}>
          <Ring score={84} color={colors.primary} label="Recovery" />
          <Ring score={73} color={colors.violet} label="Sleep" />
          <Ring score={62} color={colors.rose} label="Strain" />
        </View>
        <View style={styles.grid3}>
          <InfoBox label="HRV" value="68 ms" />
          <InfoBox label="Resting HR" value="52 bpm" />
          <InfoBox label="Calories" value="2,340" />
        </View>
      </Card>
    </View>
  );
}
