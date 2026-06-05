import { useCallback, useEffect, useState } from 'react';

import type { CurrentMobileUser } from '@/src/services/mobileUserApi';
import { getCurrentMobileUser } from '@/src/services/mobileUserApi';

export function useCurrentMobileUser() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CurrentMobileUser | null>(null);

  const refreshCurrentMobileUser = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const currentUser = await getCurrentMobileUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load current user.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCurrentMobileUser();
  }, [refreshCurrentMobileUser]);

  return {
    errorMessage,
    isLoading,
    refreshCurrentMobileUser,
    user,
  };
}
