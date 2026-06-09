import type { ReactNode } from 'react';
import { Text, View, type ColorValue } from 'react-native';

import { cardStyles as styles } from '@/src/styles/cardStyles';
import { layoutStyles } from '@/src/styles/layoutStyles';

import { Ring } from './charts';
import { Label, MetricValue, Pill } from './metricWidgets';

export function Card({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: ColorValue;
}) {
  return <View style={[styles.card, accent ? { borderTopColor: accent, borderTopWidth: 3 } : null]}>{children}</View>;
}

export function CardMeta({ text }: { text: string }) {
  return <Text style={styles.cardMeta}>{text}</Text>;
}

export function ScoreCard({
  label,
  meta,
  title,
  score,
  color,
  pill,
}: {
  label: string;
  meta?: string;
  title: string;
  score?: number;
  color: string;
  pill: string;
}) {
  return (
    <Card accent={color}>
      <Label color={color}>{label}</Label>
      {meta ? <CardMeta text={meta} /> : null}
      <Text style={styles.scoreTitle}>{title}</Text>
      <Ring score={score} color={color} />
      <View style={layoutStyles.center}>
        <Pill color={color} bg={`${color}1A`} text={pill} />
      </View>
    </Card>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  color,
  pill,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  color: string;
  pill?: string;
  sub?: string;
}) {
  return (
    <Card accent={color}>
      <Label>{label}</Label>
      <MetricValue value={value} unit={unit} color={color} />
      {pill ? <Pill color={color} bg={`${color}1A`} text={pill} /> : null}
      {sub ? <Text style={styles.metricSub}>{sub}</Text> : null}
    </Card>
  );
}

export function StatsCard({
  meta,
  title,
  rows,
}: {
  meta?: string;
  title: string;
  rows: [string, string, string][];
}) {
  return (
    <Card>
      <Label>{title}</Label>
      {meta ? <CardMeta text={meta} /> : null}
      {rows.map(([label, value, color], index) => (
        <View key={label} style={[styles.statRow, index === rows.length - 1 && styles.statRowLast]}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
      ))}
    </Card>
  );
}
