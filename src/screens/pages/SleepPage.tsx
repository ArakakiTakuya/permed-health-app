import { Text, View } from 'react-native';

import { Card, StatsCard } from '@/src/components/dashboard/cards';
import { LineChart } from '@/src/components/dashboard/charts';
import { Label, SleepChip } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import type { WhoopRecoveryMetrics } from '@/src/services/whoopApi';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function SleepPage({ dashboard }: { dashboard: WhoopRecoveryMetrics }) {
  const sleepRange = formatSleepRange(dashboard.sleepStartAt, dashboard.sleepEndAt);
  const totalSleepMilli = sumMilliseconds(
    dashboard.totalLightSleepTimeMilli,
    dashboard.totalSlowWaveSleepTimeMilli,
    dashboard.totalRemSleepTimeMilli,
  );

  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.violet} title="Sleep" subtitle="Withings Sleep Analyzer + WHOOP · Last Night" />
      <View style={heroStyles.violetHero}>
        <View style={styles.splitHeader}>
          <View>
            <Text style={heroStyles.heroLabel}>TOTAL SLEEP</Text>
            <Text style={heroStyles.heroNumber}>
              {formatMilliseconds(totalSleepMilli)}
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
          <SleepChip label="AWAKE" value={formatMilliseconds(dashboard.totalAwakeTimeMilli)} translucent />
          <SleepChip label="REM" value={formatMilliseconds(dashboard.totalRemSleepTimeMilli)} translucent />
          <SleepChip label="LIGHT" value={formatMilliseconds(dashboard.totalLightSleepTimeMilli)} translucent />
          <SleepChip label="DEEP" value={formatMilliseconds(dashboard.totalSlowWaveSleepTimeMilli)} translucent />
        </View>
      </View>
      <Card accent={colors.violet}>
        <Label color={colors.violet}>OVERNIGHT HEART RATE</Label>
        <LineChart data={[]} color={colors.violet} min={45} max={95} tall />
      </Card>
      <StatsCard
        title="WITHINGS SLEEP MAT"
        rows={[
          ['Bedtime', '--', colors.text],
          ['Wake Time', '--', colors.text],
          ['Latency', '--', colors.sage],
          ['Snoring', '--', colors.sage],
          ['Interruptions', '--', colors.amber],
          ['Apnea Index', '--', colors.sage],
          ['Avg Night HR', '--', colors.violet],
        ]}
      />
      <StatsCard
        title="WHOOP SLEEP PERFORMANCE"
        rows={[
          ['Sleep Performance', formatPercentage(dashboard.sleepScore), colors.violet],
          ['Sleep Need', formatMilliseconds(dashboard.sleepNeedMilli), colors.text],
          ['Sleep Debt', formatMilliseconds(dashboard.sleepDebtMilli), colors.rose],
          ['Deep (SWS)', formatMilliseconds(dashboard.totalSlowWaveSleepTimeMilli), colors.primary],
          ['Recovery Score', formatPercentage(dashboard.score), colors.primary],
        ]}
      />
    </View>
  );
}

function formatScore(score: number | undefined) {
  return typeof score === 'number' ? `${Math.round(score)} / 100` : '--';
}

function formatPercentage(value: number | undefined) {
  return typeof value === 'number' ? `${Math.round(value)}%` : '--';
}

function formatSleepRange(startAt: string | undefined, endAt: string | undefined) {
  if (!startAt || !endAt) {
    return '--';
  }

  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

function formatTime(value: string | undefined) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatMilliseconds(value: number | undefined) {
  if (typeof value !== 'number') {
    return '--';
  }

  const durationMinutes = Math.round(value / (60 * 1000));
  return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
}

function sumMilliseconds(...values: (number | undefined)[]) {
  if (values.every((value) => typeof value !== 'number')) {
    return undefined;
  }

  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}
