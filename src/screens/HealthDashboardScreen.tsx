import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type TabKey } from '@/src/components/navigation/dashboardTabs';

import { BottomNav } from '@/src/components/BottomNav';
import { TopBar } from '@/src/components/TopBar';
import { useAppleHealthAuth } from '@/src/hooks/useAppleHealthAuth';
import { useCurrentMobileUser } from '@/src/hooks/useCurrentMobileUser';
import { useWithingsDashboard } from '@/src/hooks/useWithingsDashboard';
import { useWithingsAuth } from '@/src/hooks/useWithingsAuth';
import { useWhoopAuth } from '@/src/hooks/useWhoopAuth';
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
  const {
    connectAppleHealth,
    status: appleHealthConnectStatus,
  } = useAppleHealthAuth();
  const { user } = useCurrentMobileUser();
  const { recovery, syncAndRefreshRecovery } = useWhoopRecovery();
  const {
    dashboard: withingsDashboard,
    syncAndRefreshWithingsDashboard,
  } = useWithingsDashboard();
  const { connectWhoop, status: whoopConnectStatus } = useWhoopAuth({
    onConnected: syncAndRefreshRecovery,
  });
  const { connectWithings, status: withingsConnectStatus } = useWithingsAuth({
    onConnected: syncAndRefreshWithingsDashboard,
  });

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
          {activeTab === 'overview' && (
            <OverviewPage
              appleHealthConnectStatus={appleHealthConnectStatus}
              dashboard={recovery}
              memberEmail={user?.email}
              memberName={user?.name}
              onConnectAppleHealth={connectAppleHealth}
              onConnectWhoop={connectWhoop}
              onConnectWithings={connectWithings}
              whoopConnectStatus={whoopConnectStatus}
              withingsConnectStatus={withingsConnectStatus}
              withingsDashboard={withingsDashboard}
            />
          )}
          {activeTab === 'glucose' && <GlucosePage />}
          {activeTab === 'body' && (
            <BodyPage
              dashboard={withingsDashboard}
            />
          )}
          {activeTab === 'sleep' && (
            <SleepPage
              dashboard={recovery}
              withingsDashboard={withingsDashboard}
            />
          )}
          {activeTab === 'recovery' && <RecoveryPage dashboard={recovery} />}
          {activeTab === 'heart' && <HeartPage dashboard={recovery} />}
        </ScrollView>

        <BottomNav activeTab={activeTab} onChange={handleTabChange} onReselect={scrollToTop} />
      </View>
    </SafeAreaView>
  );
}
