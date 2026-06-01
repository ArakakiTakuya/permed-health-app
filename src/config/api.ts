export function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
}
