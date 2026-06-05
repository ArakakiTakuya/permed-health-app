import { apiFetch } from '@/src/services/apiClient';

export type CurrentMobileUser = {
  email: string | null;
  id: string;
  name: string | null;
};

type CurrentMobileUserResponse = {
  email?: unknown;
  id?: unknown;
  name?: unknown;
};

export async function getCurrentMobileUser(): Promise<CurrentMobileUser> {
  const response = await apiFetch('/api/mobile/me');
  const data = (await response.json()) as CurrentMobileUserResponse;

  if (typeof data.id !== 'string' || !data.id) {
    throw new Error('Backend did not return a mobile user.');
  }

  return {
    email: getNullableString(data.email),
    id: data.id,
    name: getNullableString(data.name),
  };
}

function getNullableString(value: unknown) {
  return typeof value === 'string' && value ? value : null;
}
