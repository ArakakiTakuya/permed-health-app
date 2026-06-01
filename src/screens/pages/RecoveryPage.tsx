import { Text, View } from 'react-native';

import { Card, StatsCard } from '@/src/components/dashboard/cards';
import { BarChart, Ring } from '@/src/components/dashboard/charts';
import { HeroStat, Label } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { WhoopConnectCard } from '@/src/components/WhoopConnectCard';
import { trendData } from '@/src/data/dashboardData';
import { useWhoopRecovery } from '@/src/hooks/useWhoopRecovery';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function RecoveryPage() {
  const { recovery, refreshRecovery } = useWhoopRecovery();

  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.rose} title="Recovery" subtitle="WHOOP · Today" />
      <View style={heroStyles.recoveryHero}>
        <Text style={heroStyles.heroLabel}>RECOVERY SCORE</Text>
        <View style={styles.splitHeader}>
          <View style={styles.centerMetric}>
            <Text style={heroStyles.recoveryNumber}>{formatScore(recovery.score)}</Text>
            <Text style={heroStyles.heroText}>Recovery</Text>
            <View style={heroStyles.whitePill}>
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
        <Ring score={Math.round(recovery.score ?? 0)} color={colors.primary} label="Recovery" />
        <Ring score={73} color={colors.violet} label="Sleep" />
        <Ring score={68} color={colors.amber} label="Activity" />
      </View>
      <WhoopConnectCard onConnected={refreshRecovery} />
      <Card accent={colors.rose}>
        <Label color={colors.rose}>Weekly Strain</Label>
        <BarChart data={trendData.strain} color={colors.rose} />
      </Card>
      <StatsCard
        title="WHOOP Metrics"
        rows={[
          ['Day Strain', '13.7', colors.rose],
          ['Respiratory Rate', formatMetric(recovery.respiratoryRate, 'rpm', 1), colors.sky],
          ['Skin Temp', '36.4 C', colors.amber],
          ['Blood Oxygen', '98%', colors.sage],
          ['Calories Burned', '2,340 kcal', colors.text],
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

  return `${value.toFixed(fractionDigits)} ${unit}`;
}
