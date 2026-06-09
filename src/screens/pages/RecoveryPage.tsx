import { Text, View } from 'react-native';

import { Card, StatsCard } from '@/src/components/dashboard/cards';
import { BarChart, Ring } from '@/src/components/dashboard/charts';
import { HeroStat, Label } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { toWeeklyStrainChartData } from '@/src/data/healthChartData';
import { formatLastSyncedAt, formatMetric, formatScore, roundScore } from '@/src/data/healthFormatters';
import type { WhoopRecoveryMetrics } from '@/src/services/whoopApi';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function RecoveryPage({
  dashboard: recovery,
  lastSyncedAt,
}: {
  dashboard: WhoopRecoveryMetrics;
  lastSyncedAt: Date | null;
}) {
  return (
    <View style={styles.panel}>
      <SectionHeader
        color={colors.rose}
        title="Recovery"
        subtitle={`WHOOP · ${formatLastSyncedAt(lastSyncedAt)}`}
      />
      <View style={heroStyles.recoveryHero}>
        <Text style={heroStyles.heroLabel}>RECOVERY SCORE</Text>
        <View style={styles.splitHeader}>
          <View style={styles.centerMetric}>
            <Text style={heroStyles.recoveryNumber}>{formatScore(recovery.score)}</Text>
            <Text style={heroStyles.heroText}>Recovery</Text>
            <View style={[heroStyles.whitePill, heroStyles.recoveryStatusPill]}>
              <Text style={heroStyles.whitePillText}>{recovery.status}</Text>
            </View>
          </View>
          <View style={heroStyles.heroStats}>
            <HeroStat label="HRV" value={formatMetric(recovery.hrvMs, 'ms')} />
            <HeroStat label="Resting HR" value={formatMetric(recovery.restingHeartRate, 'bpm')} />
            <HeroStat label="Resp. Rate" value={formatMetric(recovery.respiratoryRate, 'rpm', 1)} />
          </View>
        </View>
      </View>
      <View style={styles.ringRow}>
        <Ring
          score={roundScore(recovery.score)}
          color={colors.primary}
          label="Recovery"
        />
        <Ring
          score={roundScore(recovery.sleepScore)}
          color={colors.violet}
          label="Sleep"
        />
      </View>
      <Card accent={colors.rose}>
        <Label color={colors.rose}>WEEKLY STRAIN</Label>
        <BarChart
          color={colors.rose}
          data={toWeeklyStrainChartData(recovery.weeklyStrain)}
          maxValue={20}
          ticks={[0, 10, 20]}
        />
      </Card>
      <StatsCard
        title="WHOOP Metrics"
        rows={[
          ['Day Strain', formatMetric(recovery.dayStrain, '', 1), colors.rose],
          ['Respiratory Rate', formatMetric(recovery.respiratoryRate, 'rpm', 1), colors.sky],
          ['Skin Temp', formatMetric(recovery.skinTempCelsius, 'C', 1), colors.amber],
          ['Blood Oxygen', formatMetric(recovery.spo2Percentage, '%'), colors.sage],
          ['Calories Burned', formatMetric(recovery.caloriesBurned, 'kcal'), colors.text],
        ]}
      />
    </View>
  );
}
