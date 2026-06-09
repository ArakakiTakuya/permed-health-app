import { Text, View } from 'react-native';

import { Card, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label, SleepChip } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import {
  formatCount,
  formatLastSyncedAt,
  formatMetric,
  formatMillisecondsAsDuration,
  formatPercentage,
  formatScore,
  formatSeconds,
  formatTime,
  formatTimeRange,
  sumMilliseconds,
} from '@/src/data/healthFormatters';
import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import type { WhoopRecoveryMetrics } from '@/src/services/whoopApi';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function SleepPage({
  dashboard,
  whoopLastSyncedAt,
  withingsLastSyncedAt,
  withingsDashboard,
}: {
  dashboard: WhoopRecoveryMetrics;
  whoopLastSyncedAt: Date | null;
  withingsLastSyncedAt: Date | null;
  withingsDashboard: WithingsDashboardMetrics;
}) {
  const sleepRange = formatTimeRange(dashboard.sleepStartAt, dashboard.sleepEndAt);
  const totalSleepMilli = sumMilliseconds(
    dashboard.totalLightSleepTimeMilli,
    dashboard.totalSlowWaveSleepTimeMilli,
    dashboard.totalRemSleepTimeMilli,
  );
  const withingsSyncLabel = formatLastSyncedAt(withingsLastSyncedAt);
  const whoopSyncLabel = formatLastSyncedAt(whoopLastSyncedAt).replace('Last synced: ', '');

  return (
    <View style={styles.panel}>
      <SectionHeader
        color={colors.violet}
        title="Sleep"
        subtitle={`Withings · ${withingsSyncLabel} · WHOOP ${whoopSyncLabel}`}
      />
      <View style={heroStyles.violetHero}>
        <View style={styles.splitHeader}>
          <View>
            <Text style={heroStyles.heroLabel}>TOTAL SLEEP</Text>
            <Text style={heroStyles.heroNumber}>
              {formatMillisecondsAsDuration(totalSleepMilli)}
            </Text>
            <Text style={heroStyles.heroText}>
              Sleep Score:{' '}
              <Text style={heroStyles.boldWhite}>{formatScore(dashboard.sleepScore)}</Text>
            </Text>
          </View>
          <View style={styles.rightMetric}>
            <Text style={heroStyles.microWhite}>{sleepRange}</Text>
            <View style={heroStyles.whitePill}>
              <Text style={heroStyles.whitePillText}>
                {formatPercentage(dashboard.sleepEfficiencyPercentage)} Efficient
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.grid4}>
          <SleepChip label="AWAKE" value={formatMillisecondsAsDuration(dashboard.totalAwakeTimeMilli)} translucent />
          <SleepChip label="REM" value={formatMillisecondsAsDuration(dashboard.totalRemSleepTimeMilli)} translucent />
          <SleepChip label="LIGHT" value={formatMillisecondsAsDuration(dashboard.totalLightSleepTimeMilli)} translucent />
          <SleepChip label="DEEP" value={formatMillisecondsAsDuration(dashboard.totalSlowWaveSleepTimeMilli)} translucent />
        </View>
      </View>
      <Card accent={colors.violet}>
        <Label color={colors.violet}>OVERNIGHT HEART RATE</Label>
        <LineChart data={[]} color={colors.violet} min={45} max={95} tall />
      </Card>
      <StatsCard
        title="WITHINGS SLEEP MAT"
        rows={[
          ['Bedtime', formatTime(withingsDashboard.bedtimeAt), colors.text],
          ['Wake Time', formatTime(withingsDashboard.wakeTimeAt), colors.text],
          ['Latency', formatSeconds(withingsDashboard.latencySeconds), colors.sage],
          ['Snoring', formatSeconds(withingsDashboard.snoringSeconds), colors.sage],
          ['Interruptions', formatCount(withingsDashboard.interruptions), colors.amber],
          ['Apnea Index', formatMetric(withingsDashboard.apneaIndex, '/hr', 1), colors.sage],
          ['Avg Night HR', formatMetric(withingsDashboard.averageNightHeartRate, 'bpm'), colors.violet],
        ]}
      />
      <StatsCard
        title="WHOOP SLEEP PERFORMANCE"
        rows={[
          ['Sleep Performance', formatPercentage(dashboard.sleepScore), colors.violet],
          ['Sleep Need', formatMillisecondsAsDuration(dashboard.sleepNeedMilli), colors.text],
          ['Sleep Debt', formatMillisecondsAsDuration(dashboard.sleepDebtMilli), colors.rose],
          ['Deep (SWS)', formatMillisecondsAsDuration(dashboard.totalSlowWaveSleepTimeMilli), colors.primary],
          ['Recovery Score', formatPercentage(dashboard.score), colors.primary],
        ]}
      />
    </View>
  );
}
