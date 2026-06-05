import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';

import { createWithingsConnectSession } from '@/src/services/withingsApi';
import {
  parseWithingsCallbackUrl,
  withingsAppRedirectUri,
} from '@/src/services/withingsAuth';

WebBrowser.maybeCompleteAuthSession();

export type WithingsConnectionStatus = 'idle' | 'opening' | 'syncing' | 'connected' | 'error';

export function useWithingsAuth({
  onConnected,
}: {
  onConnected?: () => Promise<void> | void;
} = {}) {
  const [status, setStatus] = useState<WithingsConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectWithings = useCallback(async () => {
    setErrorMessage(null);

    try {
      setStatus('opening');
      const authUrl = await createWithingsConnectSession();

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        withingsAppRedirectUri,
      );

      if (result.type === 'cancel' || result.type === 'dismiss') {
        setStatus('idle');
        return;
      }

      if (result.type !== 'success') {
        setStatus('error');
        setErrorMessage('Withings authorization was not completed.');
        return;
      }

      const callback = parseWithingsCallbackUrl(result.url);

      if (callback.status === 'success') {
        setStatus('syncing');
        await onConnected?.();
        setStatus('connected');
        return;
      }

      setStatus('error');
      setErrorMessage(callback.error ?? 'Withings connection failed.');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Withings connection failed.');
    }
  }, [onConnected]);

  return {
    appRedirectUri: withingsAppRedirectUri,
    connectWithings,
    errorMessage,
    isReady: true,
    status,
  };
}
