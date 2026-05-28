import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type TabKey } from '@/src/data/dashboardData';

import { BottomNav } from '@/src/components/BottomNav';
import { TopBar } from '@/src/components/TopBar';
import { BodyPage } from './pages/BodyPage';
import { GlucosePage } from './pages/GlucosePage';
import { HeartPage } from './pages/HeartPage';
import { OverviewPage } from './pages/OverviewPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { SleepPage } from './pages/SleepPage';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function HealthDashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.appShell}>
        <TopBar />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'glucose' && <GlucosePage />}
          {activeTab === 'body' && <BodyPage />}
          {activeTab === 'sleep' && <SleepPage />}
          {activeTab === 'recovery' && <RecoveryPage />}
          {activeTab === 'heart' && <HeartPage />}
        </ScrollView>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}
