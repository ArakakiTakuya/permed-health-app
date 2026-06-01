import { getAccessToken } from '@/src/services/tokenStorage';
import { getApiBaseUrl } from '@/src/config/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new ApiError('EXPO_PUBLIC_API_BASE_URL is not configured.');
  }

  const token = await getAccessToken();

  if (!token) {
    throw new ApiError('Authentication is required.', 401);
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(`API request to ${path} failed with status ${response.status}.`, response.status);
  }

  return response;
}
