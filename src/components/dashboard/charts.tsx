import { Fragment, useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import type { BarChartPoint } from '@/src/data/healthChartData';
import { chartStyles as styles } from '@/src/styles/chartStyles';
import { colors } from '@/src/theme/colors';

const RING_SIZE = 70;
const RING_STROKE_WIDTH = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const HEART_RATE_CHART_HEIGHT = 150;
const HEART_RATE_CHART_WIDTH = 280;
const HEART_RATE_PADDING = {
  bottom: 28,
  left: 34,
  right: 10,
  top: 12,
};

type HeartRateLineChartPoint = {
  bpm: number;
  measuredAt: string;
};

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

export function HeartRateLineChart({
  averageBpm,
  color,
  data,
}: {
  averageBpm?: number | null;
  color: string;
  data: HeartRateLineChartPoint[];
}) {
  const points = normalizeHeartRatePoints(data);

  if (!points.length) {
    return (
      <View style={styles.heartRateEmpty}>
        <Text style={styles.heartRateEmptyText}>No heart rate data available</Text>
      </View>
    );
  }

  const values = points.map((point) => point.bpm);
  const min = Math.floor((Math.min(...values) - 4) / 5) * 5;
  const max = Math.ceil((Math.max(...values) + 4) / 5) * 5;
  const minBpm = Math.min(...values);
  const maxBpm = Math.max(...values);
  const dataAverageBpm = values.reduce((total, value) => total + value, 0) / values.length;
  const chartAverageBpm = Number.isFinite(averageBpm ?? NaN) ? averageBpm : dataAverageBpm;
  const mid = Math.round((min + max) / 2);
  const chartWidth = HEART_RATE_CHART_WIDTH - HEART_RATE_PADDING.left - HEART_RATE_PADDING.right;
  const chartHeight = HEART_RATE_CHART_HEIGHT - HEART_RATE_PADDING.top - HEART_RATE_PADDING.bottom;
  const averageY = HEART_RATE_PADDING.top + ((max - (chartAverageBpm ?? dataAverageBpm)) / Math.max(1, max - min)) * chartHeight;
  const polylinePoints = points
    .map((point, index) => {
      const x = HEART_RATE_PADDING.left + (index / Math.max(1, points.length - 1)) * chartWidth;
      const y = HEART_RATE_PADDING.top + ((max - point.bpm) / Math.max(1, max - min)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.heartRateChart}>
      <View style={styles.heartRateSummaryRow}>
        <HeartRateSummaryItem label="Avg" value={Math.round(chartAverageBpm ?? dataAverageBpm)} />
        <HeartRateSummaryItem label="Min" value={minBpm} />
        <HeartRateSummaryItem label="Max" value={maxBpm} />
      </View>
      <Svg
        height={HEART_RATE_CHART_HEIGHT}
        viewBox={`0 0 ${HEART_RATE_CHART_WIDTH} ${HEART_RATE_CHART_HEIGHT}`}
        width="100%"
      >
        {[max, mid, min].map((tick) => {
          const y = HEART_RATE_PADDING.top + ((max - tick) / Math.max(1, max - min)) * chartHeight;

          return (
            <Fragment key={tick}>
              <SvgText
                fill={colors.faint}
                fontSize="9"
                fontWeight="700"
                textAnchor="start"
                x="0"
                y={y + 3}
              >
                {tick}
              </SvgText>
              <Line
                stroke={colors.border}
                strokeOpacity="0.9"
                strokeWidth="1"
                x1={HEART_RATE_PADDING.left}
                x2={HEART_RATE_CHART_WIDTH - HEART_RATE_PADDING.right}
                y1={y}
                y2={y}
              />
            </Fragment>
          );
        })}
        <Line
          stroke={color}
          strokeDasharray="4 4"
          strokeOpacity="0.55"
          strokeWidth="1.4"
          x1={HEART_RATE_PADDING.left}
          x2={HEART_RATE_CHART_WIDTH - HEART_RATE_PADDING.right}
          y1={averageY}
          y2={averageY}
        />
        <SvgText
          fill={color}
          fontSize="9"
          fontWeight="800"
          textAnchor="end"
          x={HEART_RATE_CHART_WIDTH - HEART_RATE_PADDING.right}
          y={Math.max(9, averageY - 5)}
        >
          avg
        </SvgText>
        <Polyline
          fill="none"
          points={polylinePoints}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </Svg>
      <View style={styles.heartRateTimeRow}>
        <Text style={styles.heartRateTime}>{formatChartTime(points[0]?.measuredAt)}</Text>
        <Text style={styles.heartRateTime}>{formatChartTime(points[points.length - 1]?.measuredAt)}</Text>
      </View>
    </View>
  );
}

function HeartRateSummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.heartRateSummaryItem}>
      <Text style={styles.heartRateSummaryLabel}>{label}</Text>
      <Text style={styles.heartRateSummaryValue}>{value} bpm</Text>
    </View>
  );
}

export function BarChart({
  color,
  data,
  maxValue,
  ticks = [],
}: {
  color: string;
  data: BarChartPoint[];
  maxValue?: number;
  ticks?: number[];
}) {
  const values = data.map((item) => item.value).filter((value): value is number => typeof value === 'number');
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
          const { label, value } = item;
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

function normalizeHeartRatePoints(data: HeartRateLineChartPoint[]) {
  return data
    .filter((point) => {
      const timestamp = new Date(point.measuredAt).getTime();
      return Number.isFinite(point.bpm) && !Number.isNaN(timestamp);
    })
    .sort((first, second) => new Date(first.measuredAt).getTime() - new Date(second.measuredAt).getTime());
}

function formatChartTime(value: string | undefined) {
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
