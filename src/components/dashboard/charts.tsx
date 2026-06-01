import { Text, View } from 'react-native';

import { chartStyles as styles } from '@/src/styles/chartStyles';
import { colors } from '@/src/theme/colors';

export function Ring({ score, color, label }: { score?: number; color: string; label?: string }) {
  const remaining = Math.max(0, 100 - (score ?? 0));
  return (
    <View style={styles.ringWrap}>
      <View style={[styles.ring, { borderColor: color }]}>
        <View style={[styles.ringGap, { borderTopColor: colors.border, transform: [{ rotate: `${remaining * 1.8}deg` }] }]} />
        <Text style={styles.ringScore}>{score ?? '--'}</Text>
      </View>
      {label ? <Text style={styles.ringLabel}>{label}</Text> : null}
    </View>
  );
}

export function LineChart({
  data,
  color,
  min,
  max,
  tall,
}: {
  data: number[];
  color: string;
  min: number;
  max: number;
  tall?: boolean;
}) {
  return (
    <View style={[styles.chart, tall && styles.chartTall]}>
      {data.map((value, index) => {
        const height = Math.max(12, ((value - min) / (max - min)) * (tall ? 122 : 70));
        return (
          <View key={`${value}-${index}`} style={styles.chartColumn}>
            <View style={[styles.chartStem, { height, backgroundColor: `${color}22`, borderColor: color }]} />
            <View style={[styles.chartDot, { backgroundColor: color }]} />
          </View>
        );
      })}
    </View>
  );
}

export function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <View style={styles.barChart}>
      {data.map((value, index) => (
        <View key={`${value}-${index}`} style={styles.barColumn}>
          <View style={[styles.bar, { height: Math.max(20, (value / max) * 112), backgroundColor: `${color}24`, borderColor: color }]} />
          <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
        </View>
      ))}
    </View>
  );
}

export function SleepDonut() {
  return (
    <View style={styles.donut}>
      <View style={[styles.donutSlice, { backgroundColor: colors.violet, width: 66 }]} />
      <View style={[styles.donutSlice, { backgroundColor: colors.sky, width: 52, top: 20 }]} />
      <View style={[styles.donutSlice, { backgroundColor: colors.primary, width: 40, top: 42 }]} />
      <Text style={styles.donutText}>78</Text>
    </View>
  );
}

export function CompositionDonut() {
  return (
    <View style={styles.compositionDonut}>
      <View style={[styles.compositionBand, { backgroundColor: colors.primary, width: 118 }]} />
      <View style={[styles.compositionBand, { backgroundColor: colors.rose, width: 90, top: 24 }]} />
      <View style={[styles.compositionBand, { backgroundColor: colors.sky, width: 62, top: 48 }]} />
    </View>
  );
}
