import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import {
  getLatestWithingsDashboard,
  syncWithingsData,
} from '@/src/services/withingsApi';
import { useSyncedResource } from '@/src/hooks/useSyncedResource';

const EMPTY_WITHINGS_DASHBOARD: WithingsDashboardMetrics = {};

export function useWithingsDashboard() {
  const {
    data: dashboard,
    errorMessage,
    isLoading,
    lastSyncedAt,
    refresh: refreshWithingsDashboard,
    syncAndRefresh: syncAndRefreshWithingsDashboard,
  } = useSyncedResource({
    initialData: EMPTY_WITHINGS_DASHBOARD,
    load: getLatestWithingsDashboard,
    loadErrorMessage: 'Unable to load Withings data.',
    source: 'withings',
    sync: syncWithingsData,
    syncErrorMessage: 'Unable to sync Withings data.',
  });

  return {
    dashboard,
    errorMessage,
    isLoading,
    lastSyncedAt,
    refreshWithingsDashboard,
    syncAndRefreshWithingsDashboard,
  };
}
