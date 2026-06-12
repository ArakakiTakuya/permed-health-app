import { useCallback, useEffect, useState } from 'react';

import {
  getLastSyncDate,
  isSyncStale,
  markSyncedNow,
  type SyncSource,
} from '@/src/services/syncMetadata';

type UseSyncedResourceOptions<T> = {
  initialData: T;
  load: () => Promise<T>;
  loadErrorMessage: string;
  source: SyncSource;
  sync: () => Promise<void>;
  syncErrorMessage: string;
};

export function useSyncedResource<T>({
  initialData,
  load,
  loadErrorMessage,
  source,
  sync,
  syncErrorMessage,
}: UseSyncedResourceOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const latestData = await load();
      setData(latestData);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : loadErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [load, loadErrorMessage]);

  const syncAndRefresh = useCallback(async () => {
    await sync();
    await markSyncedNow(source);
    setLastSyncedAt(await getLastSyncDate(source));
    await refresh();
  }, [refresh, source, sync]);

  useEffect(() => {
    let isMounted = true;

    async function refreshThenSyncIfStale() {
      await refresh();

      if (!isMounted || !(await isSyncStale(source))) {
        return;
      }

      try {
        await sync();
        await markSyncedNow(source);
        setLastSyncedAt(await getLastSyncDate(source));

        if (isMounted) {
          await refresh();
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : syncErrorMessage);
        }
      }
    }

    refreshThenSyncIfStale();
    getLastSyncDate(source).then((value) => {
      if (isMounted) {
        setLastSyncedAt(value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [refresh, source, sync, syncErrorMessage]);

  return {
    data,
    errorMessage,
    isLoading,
    lastSyncedAt,
    refresh,
    syncAndRefresh,
  };
}
