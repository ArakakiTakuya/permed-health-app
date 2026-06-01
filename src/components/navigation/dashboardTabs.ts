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
