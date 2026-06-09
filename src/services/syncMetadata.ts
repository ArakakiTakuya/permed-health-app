import * as SecureStore from 'expo-secure-store';

const STALE_SYNC_INTERVAL_MS = 30 * 60 * 1000;

type SyncSource = 'whoop' | 'withings';

export async function isSyncStale(source: SyncSource) {
  const lastSyncedAt = await getLastSyncedAt(source);

  if (!lastSyncedAt) {
    return true;
  }

  return Date.now() - lastSyncedAt.getTime() >= STALE_SYNC_INTERVAL_MS;
}

export async function getLastSyncDate(source: SyncSource) {
  return getLastSyncedAt(source);
}

export async function markSyncedNow(source: SyncSource) {
  await SecureStore.setItemAsync(getLastSyncedAtKey(source), new Date().toISOString());
}

async function getLastSyncedAt(source: SyncSource) {
  const value = await SecureStore.getItemAsync(getLastSyncedAtKey(source));

  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getLastSyncedAtKey(source: SyncSource) {
  return `permed_last_synced_at_${source}`;
}
