import { Text, View } from 'react-native';

import { Card, StatsCard } from '@/src/components/dashboard/cards';
import { BarChart, Ring } from '@/src/components/dashboard/charts';
import { HeroStat, Label } from '@/src/components/dashboard/metricWidgets';
import { SectionHeader } from '@/src/components/dashboard/sections';
import { trendData } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { heroStyles } from '@/src/styles/heroStyles';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function RecoveryPage() {
  return (
    <View style={styles.panel}>
      <SectionHeader color={colors.rose} title="Recovery" subtitle="WHOOP · Today" />
      <View style={heroStyles.recoveryHero}>
        <Text style={heroStyles.heroLabel}>RECOVERY SCORE</Text>
        <View style={styles.splitHeader}>
          <View style={styles.centerMetric}>
            <Text style={heroStyles.recoveryNumber}>84</Text>
            <Text style={heroStyles.heroText}>Recovery</Text>
            <View style={heroStyles.whitePill}>
              <Text style={heroStyles.whitePillText}>Excellent</Text>
            </View>
          </View>
          <View style={heroStyles.heroStats}>
            <HeroStat label="HRV" value="68 ms" />
            <HeroStat label="Resting HR" value="52 bpm" />
            <HeroStat label="Resp. Rate" value="14.2 rpm" />
          </View>
        </View>
      </View>
      <View style={styles.ringRow}>
        <Ring score={84} color={colors.primary} label="Recovery" />
        <Ring score={73} color={colors.violet} label="Sleep" />
        <Ring score={68} color={colors.amber} label="Activity" />
      </View>
      <Card accent={colors.rose}>
        <Label color={colors.rose}>Weekly Strain</Label>
        <BarChart data={trendData.strain} color={colors.rose} />
      </Card>
      <StatsCard
        title="WHOOP Metrics"
        rows={[
          ['Day Strain', '13.7', colors.rose],
          ['Respiratory Rate', '14.2 rpm', colors.sky],
          ['Skin Temp', '36.4 C', colors.amber],
          ['Blood Oxygen', '98%', colors.sage],
          ['Calories Burned', '2,340 kcal', colors.text],
        ]}
      />
    </View>
  );
}
