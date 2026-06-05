import { useCallback, useEffect, useState } from 'react';

import type { WithingsDashboardMetrics } from '@/src/data/withingsDashboard';
import {
  getLatestWithingsDashboard,
  syncWithingsData,
} from '@/src/services/withingsApi';

const EMPTY_WITHINGS_DASHBOARD: WithingsDashboardMetrics = {};

export function useWithingsDashboard() {
  const [dashboard, setDashboard] = useState<WithingsDashboardMetrics>(EMPTY_WITHINGS_DASHBOARD);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    await refreshWithingsDashboard();
  }, [refreshWithingsDashboard]);

  useEffect(() => {
    refreshWithingsDashboard();
  }, [refreshWithingsDashboard]);

  return {
    dashboard,
    errorMessage,
    isLoading,
    refreshWithingsDashboard,
    syncAndRefreshWithingsDashboard,
  };
}
