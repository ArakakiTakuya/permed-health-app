import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type TabKey } from '@/src/components/navigation/dashboardTabs';

import { BottomNav } from '@/src/components/BottomNav';
import { TopBar } from '@/src/components/TopBar';
import { useWhoopRecovery } from '@/src/hooks/useWhoopRecovery';
import { BodyPage } from './pages/BodyPage';
import { GlucosePage } from './pages/GlucosePage';
import { HeartPage } from './pages/HeartPage';
import { OverviewPage } from './pages/OverviewPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { SleepPage } from './pages/SleepPage';
import { layoutStyles as styles } from '@/src/styles/layoutStyles';

export function HealthDashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const scrollViewRef = useRef<ScrollView>(null);
  const { recovery, syncAndRefreshRecovery } = useWhoopRecovery();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.appShell}>
        <TopBar />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'glucose' && <GlucosePage />}
          {activeTab === 'body' && <BodyPage />}
          {activeTab === 'sleep' && <SleepPage dashboard={recovery} />}
          {activeTab === 'recovery' && (
            <RecoveryPage dashboard={recovery} onConnected={syncAndRefreshRecovery} />
          )}
          {activeTab === 'heart' && <HeartPage />}
        </ScrollView>

        <BottomNav activeTab={activeTab} onChange={handleTabChange} onReselect={scrollToTop} />
      </View>
    </SafeAreaView>
  );
}
