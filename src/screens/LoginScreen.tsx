import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { useMobileAuth } from '@/src/hooks/useMobileAuth';
import { authStyles as styles } from '@/src/styles/authStyles';

type MobileAuth = ReturnType<typeof useMobileAuth>;

export function LoginScreen({ auth }: { auth: MobileAuth }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>+</Text>
        </View>
        <Text style={styles.title}>PerMed Care</Text>
        <Text style={styles.subtitle}>Sign in to connect your health data.</Text>

        {auth.errorMessage ? <Text style={styles.errorText}>{auth.errorMessage}</Text> : null}

        <Pressable
          accessibilityRole="button"
          disabled={!auth.isReady || auth.isBusy}
          onPress={auth.signIn}
          style={[styles.button, (!auth.isReady || auth.isBusy) && styles.buttonDisabled]}
        >
          {auth.isBusy ? <ActivityIndicator color="#ffffff" /> : null}
          <Text style={styles.buttonText}>
            {auth.status === 'checking'
              ? 'Checking session...'
              : auth.status === 'exchanging'
                ? 'Signing in...'
                : 'Sign in with email'}
          </Text>
        </Pressable>

        <Text style={styles.redirectHint}>Return URI: {auth.redirectUri}</Text>
      </View>
    </SafeAreaView>
  );
}
