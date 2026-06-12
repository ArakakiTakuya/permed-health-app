import {
  getLatestWhoopDashboard,
  syncWhoopData,
  type WhoopRecoveryMetrics,
} from '@/src/services/whoopApi';
import { useSyncedResource } from '@/src/hooks/useSyncedResource';

const EMPTY_RECOVERY: WhoopRecoveryMetrics = {
  status: '--',
  weeklyStrain: [],
};

export function useWhoopRecovery() {
  const {
    data: recovery,
    errorMessage,
    isLoading,
    lastSyncedAt,
    refresh: refreshRecovery,
    syncAndRefresh: syncAndRefreshRecovery,
  } = useSyncedResource({
    initialData: EMPTY_RECOVERY,
    load: getLatestWhoopDashboard,
    loadErrorMessage: 'Unable to load WHOOP recovery.',
    source: 'whoop',
    sync: syncWhoopData,
    syncErrorMessage: 'Unable to sync WHOOP recovery.',
  });

  return {
    errorMessage,
    isLoading,
    lastSyncedAt,
    recovery,
    refreshRecovery,
    syncAndRefreshRecovery,
  };
}
