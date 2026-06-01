import { Text, View } from 'react-native';

import { StatsCard } from '@/src/components/dashboard/cards';
import { Ring } from '@/src/components/dashboard/charts';
import { HeroStat } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { WhoopConnectCard } from '@/src/components/WhoopConnectCard';
import { useWhoopRecovery } from '@/src/hooks/useWhoopRecovery';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function RecoveryPage() {
  const { recovery, syncAndRefreshRecovery } = useWhoopRecovery();

  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.rose} title="Recovery" subtitle="WHOOP · Today" />
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
          score={typeof recovery.score === 'number' ? Math.round(recovery.score) : undefined}
          color={colors.primary}
          label="Recovery"
        />
        <Ring
          score={typeof recovery.sleepScore === 'number' ? Math.round(recovery.sleepScore) : undefined}
          color={colors.violet}
          label="Sleep"
        />
      </View>
      <WhoopConnectCard onConnected={syncAndRefreshRecovery} />
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

function formatScore(score: number | undefined) {
  return typeof score === 'number' ? Math.round(score) : '--';
}

function formatMetric(value: number | undefined, unit: string, fractionDigits = 0) {
  if (typeof value !== 'number') {
    return '--';
  }

  return [value.toFixed(fractionDigits), unit].filter(Boolean).join(' ');
}
