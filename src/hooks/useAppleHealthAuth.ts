import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export type AppleHealthConnectionStatus = 'idle' | 'opening' | 'syncing' | 'connected' | 'error';

export function useAppleHealthAuth() {
  const [status, setStatus] = useState<AppleHealthConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectAppleHealth = useCallback(async () => {
    setErrorMessage(null);

    if (Platform.OS !== 'ios') {
      setStatus('error');
      setErrorMessage('Apple Health is only available on iOS.');
      Alert.alert('Apple Health', 'Apple Health is only available on iOS.');
      return;
    }

    setStatus('opening');
    Alert.alert(
      'Apple Health',
      'Apple Health connection requires HealthKit permission support. Please add the HealthKit integration before requesting access.',
      [
        {
          onPress: () => setStatus('idle'),
          text: 'OK',
        },
      ],
    );
  }, []);

  return {
    connectAppleHealth,
    errorMessage,
    isReady: true,
    status,
  };
}
