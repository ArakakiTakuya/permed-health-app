import { useCallback, useEffect, useState } from 'react';

import {
  getLatestWhoopDashboard,
  syncWhoopData,
  type WhoopRecoveryMetrics,
} from '@/src/services/whoopApi';
import { getLastSyncDate, isSyncStale, markSyncedNow } from '@/src/services/syncMetadata';

const EMPTY_RECOVERY: WhoopRecoveryMetrics = {
  status: '--',
  weeklyStrain: [],
};

export function useWhoopRecovery() {
  const [recovery, setRecovery] = useState<WhoopRecoveryMetrics>(EMPTY_RECOVERY);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const refreshRecovery = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const latestRecovery = await getLatestWhoopDashboard();
      setRecovery(latestRecovery);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load WHOOP recovery.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncAndRefreshRecovery = useCallback(async () => {
    await syncWhoopData();
    await markSyncedNow('whoop');
    setLastSyncedAt(await getLastSyncDate('whoop'));
    await refreshRecovery();
  }, [refreshRecovery]);

  useEffect(() => {
    let isMounted = true;

    async function refreshThenSyncIfStale() {
      await refreshRecovery();

      if (!isMounted || !(await isSyncStale('whoop'))) {
        return;
      }

      try {
        await syncWhoopData();
        await markSyncedNow('whoop');
        setLastSyncedAt(await getLastSyncDate('whoop'));

        if (isMounted) {
          await refreshRecovery();
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to sync WHOOP recovery.');
        }
      }
    }

    refreshThenSyncIfStale();
    getLastSyncDate('whoop').then((value) => {
      if (isMounted) {
        setLastSyncedAt(value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [refreshRecovery]);

  return {
    errorMessage,
    isLoading,
    lastSyncedAt,
    recovery,
    refreshRecovery,
    syncAndRefreshRecovery,
  };
}
