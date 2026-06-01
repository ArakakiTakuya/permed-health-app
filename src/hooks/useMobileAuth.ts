import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import {
  exchangeMobileAuthCode,
  getMobileLoginUrl,
  mobileAuthRedirectUri,
  parseMobileAuthCallbackUrl,
} from '@/src/services/mobileAuth';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/src/services/tokenStorage';

WebBrowser.maybeCompleteAuthSession();

type MobileAuthStatus = 'checking' | 'idle' | 'opening' | 'exchanging' | 'authenticated' | 'error';

export function useMobileAuth() {
  const [status, setStatus] = useState<MobileAuthStatus>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginUrl = getMobileLoginUrl();

  useEffect(() => {
    async function checkToken() {
      const token = await getAccessToken();
      setStatus(token ? 'authenticated' : 'idle');
    }

    checkToken();
  }, []);

  const signIn = useCallback(async () => {
    setErrorMessage(null);

    if (!loginUrl) {
      setStatus('error');
      setErrorMessage('EXPO_PUBLIC_API_BASE_URL is not configured.');
      return;
    }

    try {
      setStatus('opening');
      const result = await WebBrowser.openAuthSessionAsync(loginUrl, mobileAuthRedirectUri);

      if (result.type === 'cancel' || result.type === 'dismiss') {
        setStatus('idle');
        return;
      }

      if (result.type !== 'success') {
        setStatus('error');
        setErrorMessage('Login was not completed.');
        return;
      }

      const callback = parseMobileAuthCallbackUrl(result.url);

      if (callback.error) {
        setStatus('error');
        setErrorMessage(callback.error);
        return;
      }

      if (!callback.code) {
        setStatus('error');
        setErrorMessage('Login callback did not include a code.');
        return;
      }

      setStatus('exchanging');
      const accessToken = await exchangeMobileAuthCode(callback.code);
      await setAccessToken(accessToken);
      setStatus('authenticated');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Login failed.');
    }
  }, [loginUrl]);

  const signOut = useCallback(async () => {
    await clearAccessToken();
    setStatus('idle');
  }, []);

  return {
    errorMessage,
    isAuthenticated: status === 'authenticated',
    isBusy: status === 'checking' || status === 'opening' || status === 'exchanging',
    isReady: Boolean(loginUrl),
    redirectUri: mobileAuthRedirectUri,
    signIn,
    signOut,
    status,
  };
}
