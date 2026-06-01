import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';

import {
  getWhoopBackendCallbackUrl,
  parseWhoopCallbackUrl,
  whoopAppRedirectUri,
} from '@/src/services/whoopAuth';
import { createWhoopConnectSession } from '@/src/services/whoopApi';

WebBrowser.maybeCompleteAuthSession();

type WhoopConnectionStatus = 'idle' | 'opening' | 'syncing' | 'connected' | 'error';

export function useWhoopAuth({
  onConnected,
}: {
  onConnected?: () => Promise<void> | void;
} = {}) {
  const [status, setStatus] = useState<WhoopConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const backendCallbackUrl = getWhoopBackendCallbackUrl();

  const connectWhoop = useCallback(async () => {
    setErrorMessage(null);

    try {
      setStatus('opening');
      const authStartUrl = await createWhoopConnectSession();

      const result = await WebBrowser.openAuthSessionAsync(
        authStartUrl,
        whoopAppRedirectUri,
      );

      if (result.type === 'cancel' || result.type === 'dismiss') {
        setStatus('idle');
        return;
      }

      if (result.type !== 'success') {
        setStatus('error');
        setErrorMessage('WHOOP authorization was not completed.');
        return;
      }

      const callback = parseWhoopCallbackUrl(result.url);

      if (callback.status === 'success') {
        setStatus('syncing');
        await onConnected?.();
        setStatus('connected');
        return;
      }

      setStatus('error');
      setErrorMessage(callback.error ?? 'WHOOP connection failed.');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'WHOOP connection failed.');
    }
  }, [onConnected]);

  return {
    appRedirectUri: whoopAppRedirectUri,
    backendCallbackUrl,
    connectWhoop,
    errorMessage,
    isReady: Boolean(backendCallbackUrl),
    status,
  };
}
