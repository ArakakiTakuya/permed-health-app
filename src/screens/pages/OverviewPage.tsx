import { Text, View } from 'react-native';

import { Card, CardMeta, ScoreCard } from '@/src/components/dashboard/cards';
import { LineChart, Ring } from '@/src/components/dashboard/charts';
import { getGlucoseStatusColor } from '@/src/components/dashboard/glucoseDisplay';
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
  formatGlucosePercentage,
  getAppleHealthGlucoseStats,
  getGlucoseStatusLabel,
} from '@/src/data/appleHealthGlucose';
import {
  formatDataWeekday,
  formatMetric,
  formatMetricValue,
  formatScore,
  formatSecondsAsDuration,
  getScoreLabel,
  roundScore,
} from '@/src/data/healthFormatters';
import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import type { AppleHealthConnectionStatus } from '@/src/hooks/useAppleHealthAuth';
import type { WithingsConnectionStatus } from '@/src/hooks/useWithingsAuth';
import type { WhoopConnectionStatus } from '@/src/hooks/useWhoopAuth';
import type { AppleHealthSnapshot } from '@/src/services/appleHealth';
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
  appleHealthSnapshot,
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
  appleHealthSnapshot?: AppleHealthSnapshot | null;
  whoopConnectStatus: WhoopConnectionStatus;
  withingsConnectStatus: WithingsConnectionStatus;
  withingsDashboard: WithingsDashboardMetrics;
}) {
  const whoopConnected = whoopConnectStatus === 'connected' || hasWhoopData(dashboard);
  const withingsConnected =
    withingsConnectStatus === 'connected' || hasWithingsData(withingsDashboard);
  const whoopDataLabel = formatDataWeekday(dashboard.recoveryDate ?? dashboard.cycleStartAt);
  const withingsDataLabel = formatDataWeekday(withingsDashboard.sleepDate ?? withingsDashboard.bedtimeAt);
  const glucoseStats = getAppleHealthGlucoseStats(appleHealthSnapshot);
  const glucoseDataLabel = formatDataWeekday(glucoseStats.latestMeasuredAt);
  const currentGlucoseStatusColor = getGlucoseStatusColor(glucoseStats.latestMgDl, colors.faint);

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
      <SectionHeader
        color={colors.primary}
        title="Daily Scores"
        subtitle="WHOOP, Withings, Lingo"
      />
      <View style={styles.grid2}>
        <ScoreCard
          label="WHOOP"
          meta={whoopDataLabel}
          title="Recovery"
          score={roundScore(dashboard.score)}
          color={colors.primary}
          pill={dashboard.status}
        />
        <ScoreCard
          label="Withings"
          meta={withingsDataLabel}
          title="Sleep Score"
          score={roundScore(withingsDashboard.sleepScore)}
          color={colors.violet}
          pill={getScoreLabel(withingsDashboard.sleepScore)}
        />
        <ScoreCard
          label="Lingo"
          meta={glucoseDataLabel}
          title="Time in Range"
          score={roundScore(glucoseStats.timeInRangePercentage)}
          color={colors.amber}
          pill={getGlucoseStatusLabel(glucoseStats.latestMgDl)}
        />
        <ScoreCard label="Withings" meta={formatDataWeekday(withingsDashboard.bodyMeasuredAt)} title="Body Score" color={colors.sky} pill="--" />
      </View>

      <Card accent={colors.amber}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.amber}>Lingo CGM · Now</Label>
            <CardMeta text={glucoseDataLabel} />
            <MetricValue color={colors.amber} value={formatMetricValue(glucoseStats.latestMgDl)} unit="mg/dL" />
            <Pill
              color={currentGlucoseStatusColor}
              bg={`${currentGlucoseStatusColor}1A`}
              text={getGlucoseStatusLabel(glucoseStats.latestMgDl)}
            />
          </View>
          <View style={styles.rightMetric}>
            <Text style={widgetStyles.microMuted}>Time in Range</Text>
            <Text style={[widgetStyles.largeNumber, { color: colors.sage }]}>
              {formatGlucosePercentage(glucoseStats.timeInRangePercentage)}
            </Text>
          </View>
        </View>
        <LineChart data={glucoseStats.chartValues} color={colors.amber} min={60} max={180} />
      </Card>

      <Card accent={colors.violet}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.violet}>Withings</Label>
            <CardMeta text={withingsDataLabel} />
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
          <SleepChip label="AWAKE" value={formatSecondsAsDuration(withingsDashboard.awakeSleepSeconds)} color={colors.rose} />
          <SleepChip label="REM" value={formatSecondsAsDuration(withingsDashboard.remSleepSeconds)} color={colors.violet} />
          <SleepChip label="LIGHT" value={formatSecondsAsDuration(withingsDashboard.lightSleepSeconds)} color={colors.sky} />
          <SleepChip label="DEEP" value={formatSecondsAsDuration(withingsDashboard.deepSleepSeconds)} color={colors.primary} />
        </View>
      </Card>

      <Card accent={colors.rose}>
        <Label color={colors.rose}>WHOOP · Recovery</Label>
        <CardMeta text={whoopDataLabel} />
        <View style={styles.ringRow}>
          <Ring score={roundScore(dashboard.score)} color={colors.primary} label="Recovery" />
          <Ring score={roundScore(dashboard.sleepScore)} color={colors.violet} label="Sleep" />
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
