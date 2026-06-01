import * as AuthSession from 'expo-auth-session';

import { getApiBaseUrl } from '@/src/config/api';

const MOBILE_AUTH_REDIRECT_SCHEME = 'permedhealthapp';
const MOBILE_AUTH_REDIRECT_PATH = 'auth/callback';
const MOBILE_LOGIN_PATH = '/mobile/login';
const MOBILE_AUTH_EXCHANGE_PATH = '/api/mobile/auth/exchange';

export const mobileAuthRedirectUri = AuthSession.makeRedirectUri({
  scheme: MOBILE_AUTH_REDIRECT_SCHEME,
  path: MOBILE_AUTH_REDIRECT_PATH,
});

export function getMobileLoginUrl() {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return '';
  }

  const params = new URLSearchParams({
    returnTo: mobileAuthRedirectUri,
  });

  return `${apiBaseUrl}${MOBILE_LOGIN_PATH}?${params.toString()}`;
}

export function parseMobileAuthCallbackUrl(url: string) {
  const parsedUrl = new URL(url);

  return {
    code: parsedUrl.searchParams.get('code'),
    error: parsedUrl.searchParams.get('error'),
  };
}

export async function exchangeMobileAuthCode(code: string) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured.');
  }

  const response = await fetch(`${apiBaseUrl}${MOBILE_AUTH_EXCHANGE_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirectUri: mobileAuthRedirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mobile login failed with status ${response.status}.`);
  }

  const data = (await response.json()) as {
    accessToken?: string;
    token?: string;
  };
  const accessToken = data.accessToken ?? data.token;

  if (!accessToken) {
    throw new Error('Backend did not return an access token.');
  }

  return accessToken;
}
