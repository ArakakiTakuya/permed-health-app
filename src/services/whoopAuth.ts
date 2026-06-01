import * as AuthSession from 'expo-auth-session';

import { getApiBaseUrl } from '@/src/config/api';

const WHOOP_APP_REDIRECT_SCHEME = 'permedhealthapp';
const WHOOP_APP_REDIRECT_PATH = 'whoop/callback';
const WHOOP_BACKEND_CALLBACK_PATH = '/api/whoop/callback';

export const whoopAppRedirectUri = AuthSession.makeRedirectUri({
  scheme: WHOOP_APP_REDIRECT_SCHEME,
  path: WHOOP_APP_REDIRECT_PATH,
});

export function getWhoopBackendCallbackUrl() {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return '';
  }

  return `${apiBaseUrl}${WHOOP_BACKEND_CALLBACK_PATH}`;
}

export function parseWhoopCallbackUrl(url: string) {
  const parsedUrl = new URL(url);

  return {
    error: parsedUrl.searchParams.get('error'),
    status: parsedUrl.searchParams.get('status'),
  };
}
