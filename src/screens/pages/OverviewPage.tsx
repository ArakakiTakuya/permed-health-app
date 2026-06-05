import { Text, View } from 'react-native';

import { Card, ScoreCard } from '@/src/components/dashboard/cards';
import { LineChart, Ring } from '@/src/components/dashboard/charts';
import {
  InfoBox,
  Label,
  MetricValue,
  Pill,
  SleepChip,
} from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
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
        <ScoreCard label="WHOOP" title="Recovery" color={colors.primary} pill="--" />
        <ScoreCard label="Withings" title="Sleep Score" color={colors.violet} pill="--" />
        <ScoreCard label="Lingo" title="Time in Range" color={colors.amber} pill="--" />
        <ScoreCard label="Withings" title="Body Score" color={colors.sky} pill="--" />
      </View>

      <Card accent={colors.amber}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.amber}>Lingo CGM · Now</Label>
            <MetricValue color={colors.amber} value="--" unit="mg/dL" />
            <Pill color={colors.sage} bg={colors.sageLight} text="--" />
          </View>
          <View style={styles.rightMetric}>
            <Text style={widgetStyles.microMuted}>Time in Range</Text>
            <Text style={[widgetStyles.largeNumber, { color: colors.sage }]}>--</Text>
            <Text style={widgetStyles.microMuted}>Today</Text>
          </View>
        </View>
        <LineChart data={[]} color={colors.amber} min={70} max={160} />
      </Card>

      <Card accent={colors.violet}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.violet}>Withings · Last Night</Label>
            <Text style={[widgetStyles.largeNumber, { color: colors.violet }]}>--</Text>
            <Text style={widgetStyles.bodyMuted}>Sleep Score: <Text style={widgetStyles.boldViolet}>--</Text></Text>
          </View>
          <Ring color={colors.violet} />
        </View>
        <View style={styles.grid4}>
          <SleepChip label="AWAKE" value="--" color={colors.rose} />
          <SleepChip label="REM" value="--" color={colors.violet} />
          <SleepChip label="LIGHT" value="--" color={colors.sky} />
          <SleepChip label="DEEP" value="--" color={colors.primary} />
        </View>
      </Card>

      <Card accent={colors.rose}>
        <Label color={colors.rose}>WHOOP · Recovery</Label>
        <View style={styles.ringRow}>
          <Ring color={colors.primary} label="Recovery" />
          <Ring color={colors.violet} label="Sleep" />
          <Ring color={colors.rose} label="Strain" />
        </View>
        <View style={styles.grid3}>
          <InfoBox label="HRV" value="--" />
          <InfoBox label="Resting HR" value="--" />
          <InfoBox label="Calories" value="--" />
        </View>
      </Card>
    </View>
  );
}
