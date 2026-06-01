import { useCallback, useEffect, useState } from 'react';

import { getLatestWhoopRecovery, type WhoopRecoveryMetrics } from '@/src/services/whoopApi';

const EMPTY_RECOVERY: WhoopRecoveryMetrics = {
  status: '--',
};

export function useWhoopRecovery() {
  const [recovery, setRecovery] = useState<WhoopRecoveryMetrics>(EMPTY_RECOVERY);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshRecovery = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const latestRecovery = await getLatestWhoopRecovery();
      setRecovery(latestRecovery);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load WHOOP recovery.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRecovery();
  }, [refreshRecovery]);

  return {
    errorMessage,
    isLoading,
    recovery,
    refreshRecovery,
  };
}
