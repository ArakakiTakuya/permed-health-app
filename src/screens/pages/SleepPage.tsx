import { Text, View } from 'react-native';

import { Card, CardMeta, StatsCard } from '@/src/components/dashboard/cards';
import { HeartRateLineChart } from '@/src/components/dashboard/charts';
import { Label, SleepChip } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import {
  formatCount,
  formatDataWeekday,
  formatLastSyncedAt,
  formatMetric,
  formatMillisecondsAsDuration,
  formatPercentage,
  formatScore,
  formatSeconds,
  formatSecondsAsDuration,
  formatTime,
  formatTimeRange,
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
  const sleepRange = formatTimeRange(withingsDashboard.bedtimeAt, withingsDashboard.wakeTimeAt);
  const withingsDataLabel = formatDataWeekday(withingsDashboard.sleepDate ?? withingsDashboard.bedtimeAt);
  const whoopDataLabel = formatDataWeekday(dashboard.sleepStartAt);
  const withingsSyncLabel = formatLastSyncedAt(withingsLastSyncedAt);
  const whoopSyncLabel = formatLastSyncedAt(whoopLastSyncedAt).replace('Last synced: ', '');
  const withingsSleepEfficiency = getSleepEfficiencyPercentage(
    withingsDashboard.bedtimeAt,
    withingsDashboard.wakeTimeAt,
    withingsDashboard.totalSleepSeconds,
  );

  return (
    <View style={styles.panel}>
      <SectionHeader
        color={colors.violet}
        title="Sleep"
        subtitle={`Withings · ${withingsSyncLabel} · WHOOP ${whoopSyncLabel}`}
      />
      <View style={heroStyles.violetHero}>
        <Text style={heroStyles.microWhite}>{withingsDataLabel}</Text>
        <View style={styles.splitHeader}>
          <View>
            <Text style={heroStyles.heroLabel}>TOTAL SLEEP</Text>
            <Text style={heroStyles.heroNumber}>
              {formatSecondsAsDuration(withingsDashboard.totalSleepSeconds)}
            </Text>
            <Text style={heroStyles.heroText}>
              Sleep Score:{' '}
              <Text style={heroStyles.boldWhite}>{formatScore(withingsDashboard.sleepScore)}</Text>
            </Text>
          </View>
          <View style={styles.rightMetric}>
            <Text style={heroStyles.microWhite}>{sleepRange}</Text>
            <View style={heroStyles.whitePill}>
              <Text style={heroStyles.whitePillText}>
                {formatPercentage(withingsSleepEfficiency)} Efficient
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.grid4}>
          <SleepChip label="AWAKE" value={formatSecondsAsDuration(withingsDashboard.awakeSleepSeconds)} translucent />
          <SleepChip label="REM" value={formatSecondsAsDuration(withingsDashboard.remSleepSeconds)} translucent />
          <SleepChip label="LIGHT" value={formatSecondsAsDuration(withingsDashboard.lightSleepSeconds)} translucent />
          <SleepChip label="DEEP" value={formatSecondsAsDuration(withingsDashboard.deepSleepSeconds)} translucent />
        </View>
      </View>
      <Card accent={colors.violet}>
        <View style={styles.splitHeader}>
          <View>
            <Label color={colors.violet}>OVERNIGHT HEART RATE</Label>
            <CardMeta text={withingsDataLabel} />
          </View>
        </View>
        <HeartRateLineChart
          averageBpm={withingsDashboard.averageNightHeartRate}
          color={colors.violet}
          data={withingsDashboard.overnightHeartRate ?? []}
        />
      </Card>
      <StatsCard
        title="WITHINGS SLEEP MAT"
        meta={withingsDataLabel}
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
        meta={whoopDataLabel}
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

function getSleepEfficiencyPercentage(
  bedtimeAt: string | undefined,
  wakeTimeAt: string | undefined,
  totalSleepSeconds: number | undefined,
) {
  if (!bedtimeAt || !wakeTimeAt || typeof totalSleepSeconds !== 'number') {
    return undefined;
  }

  const bedtime = new Date(bedtimeAt).getTime();
  const wakeTime = new Date(wakeTimeAt).getTime();

  if (Number.isNaN(bedtime) || Number.isNaN(wakeTime) || wakeTime <= bedtime) {
    return undefined;
  }

  return (totalSleepSeconds / ((wakeTime - bedtime) / 1000)) * 100;
}
