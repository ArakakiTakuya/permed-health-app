import { useCallback, useEffect, useState } from 'react';

import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import {
  getLatestWithingsDashboard,
  syncWithingsData,
} from '@/src/services/withingsApi';
import { getLastSyncDate, isSyncStale, markSyncedNow } from '@/src/services/syncMetadata';

const EMPTY_WITHINGS_DASHBOARD: WithingsDashboardMetrics = {};

export function useWithingsDashboard() {
  const [dashboard, setDashboard] = useState<WithingsDashboardMetrics>(EMPTY_WITHINGS_DASHBOARD);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const refreshWithingsDashboard = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const latestDashboard = await getLatestWithingsDashboard();
      setDashboard(latestDashboard);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load Withings data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncAndRefreshWithingsDashboard = useCallback(async () => {
    await syncWithingsData();
    await markSyncedNow('withings');
    setLastSyncedAt(await getLastSyncDate('withings'));
    await refreshWithingsDashboard();
  }, [refreshWithingsDashboard]);

  useEffect(() => {
    let isMounted = true;

    async function refreshThenSyncIfStale() {
      await refreshWithingsDashboard();

      if (!isMounted || !(await isSyncStale('withings'))) {
        return;
      }

      try {
        await syncWithingsData();
        await markSyncedNow('withings');
        setLastSyncedAt(await getLastSyncDate('withings'));

        if (isMounted) {
          await refreshWithingsDashboard();
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to sync Withings data.');
        }
      }
    }

    refreshThenSyncIfStale();
    getLastSyncDate('withings').then((value) => {
      if (isMounted) {
        setLastSyncedAt(value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [refreshWithingsDashboard]);

  return {
    dashboard,
    errorMessage,
    isLoading,
    lastSyncedAt,
    refreshWithingsDashboard,
    syncAndRefreshWithingsDashboard,
  };
}
