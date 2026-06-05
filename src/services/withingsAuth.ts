import * as AuthSession from 'expo-auth-session';

const WITHINGS_APP_REDIRECT_SCHEME = 'permedhealthapp';
const WITHINGS_APP_REDIRECT_PATH = 'withings/success';

export const withingsAppRedirectUri = AuthSession.makeRedirectUri({
  scheme: WITHINGS_APP_REDIRECT_SCHEME,
  path: WITHINGS_APP_REDIRECT_PATH,
});

export function parseWithingsCallbackUrl(url: string) {
  const parsedUrl = new URL(url);
  const explicitStatus = parsedUrl.searchParams.get('status');
  const returnedToSuccessPath =
    parsedUrl.hostname === 'withings' && parsedUrl.pathname === '/success';

  return {
    error: parsedUrl.searchParams.get('error'),
    status: explicitStatus ?? (returnedToSuccessPath ? 'success' : null),
  };
}
