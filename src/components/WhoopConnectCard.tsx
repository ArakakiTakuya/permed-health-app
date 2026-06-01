import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Card } from '@/src/components/dashboard/cards';
import { Label } from '@/src/components/dashboard/metricWidgets';
import { useWhoopAuth } from '@/src/hooks/useWhoopAuth';
import { cardStyles } from '@/src/styles/cardStyles';
import { widgetStyles } from '@/src/styles/widgetStyles';
import { colors } from '@/src/theme/colors';

export function WhoopConnectCard({
  onConnected,
}: {
  onConnected?: () => Promise<void> | void;
}) {
  const { appRedirectUri, backendCallbackUrl, connectWhoop, errorMessage, isReady, status } =
    useWhoopAuth({ onConnected });
  const loading = status === 'opening' || status === 'syncing';
  const connected = status === 'connected';

  return (
    <Card accent={colors.primary}>
      <View style={cardStyles.connectHeader}>
        <View>
          <Label color={colors.primary}>WHOOP OAuth</Label>
          <Text style={cardStyles.connectTitle}>
            {connected ? 'WHOOP connected' : 'Connect WHOOP'}
          </Text>
        </View>
        {loading ? <ActivityIndicator color={colors.primary} /> : null}
      </View>

      <Text style={widgetStyles.bodyMuted}>
        {connected
          ? 'The backend completed WHOOP authorization.'
          : 'Sign in with WHOOP through the backend callback flow.'}
      </Text>

      {errorMessage ? <Text style={cardStyles.connectError}>{errorMessage}</Text> : null}

      <Pressable
        accessibilityRole="button"
        disabled={!isReady || loading}
        onPress={connectWhoop}
        style={[
          cardStyles.connectButton,
          (!isReady || loading) && cardStyles.connectButtonDisabled,
        ]}
      >
        <Text style={cardStyles.connectButtonText}>
          {status === 'syncing'
            ? 'Syncing recovery...'
            : loading
              ? 'Connecting...'
              : connected
                ? 'Reconnect WHOOP'
                : 'Connect WHOOP'}
        </Text>
      </Pressable>

      <Text style={cardStyles.redirectHint}>WHOOP callback: {backendCallbackUrl}</Text>
      <Text style={cardStyles.redirectHint}>App return: {appRedirectUri}</Text>
    </Card>
  );
}
