import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { chartStyles as styles } from '@/src/styles/chartStyles';
import { colors } from '@/src/theme/colors';

const RING_SIZE = 70;
const RING_STROKE_WIDTH = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Ring({ score, color, label }: { score?: number; color: string; label?: string }) {
  const progress = useRef(new Animated.Value(0)).current;
  const normalizedScore = Math.min(100, Math.max(0, score ?? 0));
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
      toValue: normalizedScore,
      useNativeDriver: false,
    }).start();
  }, [normalizedScore, progress]);

  return (
    <View style={styles.ringWrap}>
      <View style={styles.ring}>
        <Svg height={RING_SIZE} width={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            fill="none"
            r={RING_RADIUS}
            stroke={colors.border}
            strokeWidth={RING_STROKE_WIDTH}
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            fill="none"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            r={RING_RADIUS}
            rotation="-90"
            stroke={color}
            strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth={RING_STROKE_WIDTH}
          />
        </Svg>
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

type BarChartDatum = {
  label: string;
  value?: number | null;
};

export function BarChart({
  color,
  data,
  maxValue,
  ticks = [],
}: {
  color: string;
  data: (number | BarChartDatum)[];
  maxValue?: number;
  ticks?: number[];
}) {
  const values = data.map(getBarValue).filter((value): value is number => typeof value === 'number');
  const max = maxValue ?? Math.max(...values, 20);

  return (
    <View style={styles.barChart}>
      {ticks.length ? (
        <View pointerEvents="none" style={styles.barAxis}>
          {ticks.map((tick) => (
            <View
              key={tick}
              style={[
                styles.barAxisTick,
                { bottom: getBarHeight(tick, max) + 16 },
              ]}
            >
              <Text style={styles.barAxisLabel}>{tick}</Text>
              <View style={styles.barAxisLine} />
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.barPlot}>
        {data.map((item, index) => {
          const value = getBarValue(item);
          const label = getBarLabel(item, index);
          const hasValue = typeof value === 'number';
          const height = hasValue ? Math.max(20, getBarHeight(value, max)) : 20;

          return (
            <View key={`${label}-${index}`} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  !hasValue && styles.barEmpty,
                  {
                    height,
                    backgroundColor: hasValue ? `${color}24` : 'transparent',
                    borderColor: hasValue ? color : `${color}44`,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function getBarHeight(value: number, max: number) {
  return Math.max(0, Math.min(112, (value / max) * 112));
}

function getBarValue(item: number | BarChartDatum) {
  return typeof item === 'number' ? item : item.value ?? undefined;
}

function getBarLabel(item: number | BarChartDatum, index: number) {
  return typeof item === 'number' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] : item.label;
}
