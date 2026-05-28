import type { ReactNode } from 'react';
import { Text, View, type ColorValue } from 'react-native';

import { widgetStyles as styles } from '@/src/styles/widgetStyles';
import { colors } from '@/src/theme/colors';

export function Label({ children, color = colors.faint }: { children: ReactNode; color?: ColorValue }) {
  return <Text style={[styles.label, { color }]}>{children}</Text>;
}

export function Pill({ color, bg, text }: { color: string; bg: string; text: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );
}

export function MetricValue({ value, unit, color }: { value: string; unit?: string; color: string }) {
  return (
    <Text style={[styles.metricValue, { color }]}>
      {value} {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
    </Text>
  );
}

export function SleepChip({
  label,
  value,
  color,
  translucent,
}: {
  label: string;
  value: string;
  color?: string;
  translucent?: boolean;
}) {
  return (
    <View style={[styles.sleepChip, { backgroundColor: translucent ? 'rgba(255,255,255,0.15)' : color }]}>
      <Text style={styles.sleepValue}>{value}</Text>
      <Text style={styles.sleepLabel}>{label}</Text>
    </View>
  );
}

export function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function Range({
  label,
  value,
  pct,
  color,
  bg,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
  bg: string;
}) {
  return (
    <View style={styles.range}>
      <View style={styles.rangeHeader}>
        <Text style={styles.rangeLabel}>{label}</Text>
        <Text style={[styles.rangeValue, { color }]}>{value}</Text>
      </View>
      <View style={[styles.rangeTrack, { backgroundColor: bg }]}>
        <View style={[styles.rangeFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function Legend({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={styles.legendLeft}>
        <View style={[styles.legendSwatch, { backgroundColor: color }]} />
        <Text style={styles.legendLabel}>{label}</Text>
      </View>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

export function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={styles.heroStatValue}>{value}</Text>
    </View>
  );
}
