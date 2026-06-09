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
import { hasWhoopData, hasWithingsData } from '@/src/data/healthChartData';
import {
  formatCount,
  formatMetric,
  formatScore,
  formatSecondsAsDuration,
  getScoreLabel,
  roundScore,
} from '@/src/data/healthFormatters';
import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import type { AppleHealthConnectionStatus } from '@/src/hooks/useAppleHealthAuth';
import type { WithingsConnectionStatus } from '@/src/hooks/useWithingsAuth';
import type { WhoopConnectionStatus } from '@/src/hooks/useWhoopAuth';
import type { WhoopRecoveryMetrics } from '@/src/services/whoopApi';
import { colors } from '@/src/theme/colors';

import { HeroCard } from '@/src/components/HeroCard';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';
import { widgetStyles } from '@/src/styles/widgetStyles';

export function OverviewPage({
  dashboard,
  memberEmail,
  memberName,
  onConnectAppleHealth,
  onConnectWhoop,
  onConnectWithings,
  appleHealthConnectStatus,
  whoopConnectStatus,
  withingsConnectStatus,
  withingsDashboard,
}: {
  dashboard: WhoopRecoveryMetrics;
  memberEmail?: string | null;
  memberName?: string | null;
  onConnectAppleHealth: () => void;
  onConnectWhoop: () => void;
  onConnectWithings: () => void;
  appleHealthConnectStatus: AppleHealthConnectionStatus;
  whoopConnectStatus: WhoopConnectionStatus;
  withingsConnectStatus: WithingsConnectionStatus;
  withingsDashboard: WithingsDashboardMetrics;
}) {
  const whoopConnected = whoopConnectStatus === 'connected' || hasWhoopData(dashboard);
  const withingsConnected =
    withingsConnectStatus === 'connected' || hasWithingsData(withingsDashboard);

  return (
    <View style={styles.panel}>
      <HeroCard
        devices={[
          {
            connected: whoopConnected,
            label: 'WHOOP',
            onConnect: onConnectWhoop,
            status: whoopConnectStatus,
          },
          {
            connected: withingsConnected,
            label: 'Withings',
            onConnect: onConnectWithings,
            status: withingsConnectStatus,
          },
          {
            connected: appleHealthConnectStatus === 'connected',
            label: 'Apple Health',
            onConnect: onConnectAppleHealth,
            status: appleHealthConnectStatus,
          },
        ]}
        memberEmail={memberEmail}
        memberName={memberName}
      />
      <SectionHeader color={colors.primary} title="Daily Scores" subtitle="WHOOP, Withings, Lingo · Today" />
      <View style={styles.grid2}>
        <ScoreCard
          label="WHOOP"
          title="Recovery"
          score={roundScore(dashboard.score)}
          color={colors.primary}
          pill={dashboard.status}
        />
        <ScoreCard
          label="Withings"
          title="Sleep Score"
          score={roundScore(withingsDashboard.sleepScore)}
          color={colors.violet}
          pill={getScoreLabel(withingsDashboard.sleepScore)}
        />
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
            <Text style={[widgetStyles.largeNumber, { color: colors.violet }]}>
              {formatSecondsAsDuration(withingsDashboard.totalSleepSeconds)}
            </Text>
            <Text style={widgetStyles.bodyMuted}>
              Sleep Score: <Text style={widgetStyles.boldViolet}>{formatScore(withingsDashboard.sleepScore)}</Text>
            </Text>
          </View>
          <Ring score={roundScore(withingsDashboard.sleepScore)} color={colors.violet} />
        </View>
        <View style={styles.grid4}>
          <SleepChip label="AWAKE" value={formatCount(withingsDashboard.interruptions)} color={colors.rose} />
          <SleepChip label="REM" value={formatSecondsAsDuration(withingsDashboard.remSleepSeconds)} color={colors.violet} />
          <SleepChip label="LIGHT" value={formatSecondsAsDuration(withingsDashboard.lightSleepSeconds)} color={colors.sky} />
          <SleepChip label="DEEP" value={formatSecondsAsDuration(withingsDashboard.deepSleepSeconds)} color={colors.primary} />
        </View>
      </Card>

      <Card accent={colors.rose}>
        <Label color={colors.rose}>WHOOP · Recovery</Label>
        <View style={styles.ringRow}>
          <Ring score={roundScore(dashboard.score)} color={colors.primary} label="Recovery" />
          <Ring score={roundScore(dashboard.sleepScore)} color={colors.violet} label="Sleep" />
          <Ring color={colors.rose} label="Strain" />
        </View>
        <View style={styles.grid3}>
          <InfoBox label="HRV" value={formatMetric(dashboard.hrvMs, 'ms')} />
          <InfoBox label="Resting HR" value={formatMetric(dashboard.restingHeartRate, 'bpm')} />
          <InfoBox label="Calories" value={formatMetric(dashboard.caloriesBurned, 'kcal')} />
        </View>
      </Card>
    </View>
  );
}
