import { Ionicons } from '@expo/vector-icons';

export type TabKey = 'overview' | 'glucose' | 'body' | 'sleep' | 'recovery' | 'heart';

export const dashboardTabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline' },
  { key: 'glucose', label: 'Glucose', icon: 'analytics-outline' },
  { key: 'body', label: 'Body', icon: 'body-outline' },
  { key: 'sleep', label: 'Sleep', icon: 'moon-outline' },
  { key: 'recovery', label: 'Recovery', icon: 'sunny-outline' },
  { key: 'heart', label: 'Heart', icon: 'heart-outline' },
];

export const trendData = {
  glucose: [88, 92, 118, 145, 112, 90, 130, 96],
  heart: [58, 52, 56, 72, 78, 74, 82, 62],
  weight: [68.4, 68.1, 68.3, 67.9, 68.0, 67.8, 67.6],
  strain: [12.4, 8.2, 15.1, 10.3, 13.7, 6.8, 9.5],
};
