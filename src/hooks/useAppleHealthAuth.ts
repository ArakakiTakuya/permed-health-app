import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import {
  getAppleHealthSnapshot,
  isAppleHealthAvailable,
  requestAppleHealthAccess,
  type AppleHealthSnapshot,
} from '@/src/services/appleHealth';

export type AppleHealthConnectionStatus = 'idle' | 'opening' | 'syncing' | 'connected' | 'error';

export function useAppleHealthAuth() {
  const [status, setStatus] = useState<AppleHealthConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<AppleHealthSnapshot | null>(null);

  const connectAppleHealth = useCallback(async () => {
    setErrorMessage(null);

    if (Platform.OS !== 'ios') {
      setStatus('error');
      setErrorMessage('Apple Health is only available on iOS.');
      Alert.alert('Apple Health', 'Apple Health is only available on iOS.');
      return;
    }

    const confirmed = await confirmAppleHealthConnection();

    if (!confirmed) {
      return;
    }

    try {
      setStatus('opening');

      const available = await isAppleHealthAvailable();

      if (!available) {
        setStatus('error');
        setErrorMessage('Apple Health is not available on this device.');
        Alert.alert('Apple Health', 'Apple Health is not available on this device.');
        return;
      }

      await requestAppleHealthAccess();

      setStatus('syncing');
      const latestSnapshot = await getAppleHealthSnapshot();
      setSnapshot(latestSnapshot);

      if (!hasReadableAppleHealthData(latestSnapshot)) {
        setStatus('idle');
        Alert.alert(
          'Apple Health not connected',
          'No Apple Health data could be read. If you denied access, enable permissions in the Health app settings and try again.',
        );
        return;
      }

      setStatus('connected');
      Alert.alert('Apple Health connected', getAppleHealthSummary(latestSnapshot));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Apple Health connection failed.';

      setStatus('error');
      setErrorMessage(message);
      Alert.alert('Apple Health', message);
    }
  }, []);

  return {
    connectAppleHealth,
    errorMessage,
    isReady: true,
    snapshot,
    status,
  };
}

function confirmAppleHealthConnection() {
  return new Promise<boolean>((resolve) => {
    Alert.alert(
      'Connect Apple Health?',
      'Permed Health will ask Apple Health for permission to read selected health metrics for your dashboard.',
      [
        {
          onPress: () => resolve(false),
          style: 'cancel',
          text: 'Cancel',
        },
        {
          onPress: () => resolve(true),
          text: 'Continue',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}

function getAppleHealthSummary(snapshot: AppleHealthSnapshot) {
  const values = [
    formatSnapshotValue('Steps today', snapshot.todayStepCount),
    formatSnapshotValue('Latest heart rate', snapshot.latestHeartRateBpm, 'bpm'),
    formatSnapshotValue('Resting heart rate', snapshot.restingHeartRateBpm, 'bpm'),
    formatSnapshotValue('Weight', snapshot.latestWeightKg, 'kg'),
  ].filter(Boolean);

  if (!values.length) {
    return 'Apple Health permissions were requested. No readable data was returned yet.';
  }

  return values.join('\n');
}

function hasReadableAppleHealthData(snapshot: AppleHealthSnapshot) {
  return [
    snapshot.bloodGlucoseMgDl,
    snapshot.latestHeartRateBpm,
    snapshot.latestWeightKg,
    snapshot.restingHeartRateBpm,
    snapshot.todayStepCount,
  ].some((value) => typeof value === 'number');
}

function formatSnapshotValue(label: string, value?: number, unit = '') {
  if (typeof value !== 'number') {
    return null;
  }

  const formattedValue = Number.isInteger(value) ? String(value) : value.toFixed(1);

  return `${label}: ${formattedValue}${unit ? ` ${unit}` : ''}`;
}
