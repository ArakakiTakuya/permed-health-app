import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Card } from '@/src/components/dashboard/cards';
import { Label } from '@/src/components/dashboard/metricWidgets';
import { useWithingsAuth } from '@/src/hooks/useWithingsAuth';
import { cardStyles } from '@/src/styles/cardStyles';
import { widgetStyles } from '@/src/styles/widgetStyles';
import { colors } from '@/src/theme/colors';

export function WithingsConnectCard({
  onConnected,
}: {
  onConnected?: () => Promise<void> | void;
}) {
  const { appRedirectUri, connectWithings, errorMessage, isReady, status } =
    useWithingsAuth({ onConnected });
  const loading = status === 'opening' || status === 'syncing';
  const connected = status === 'connected';

  return (
    <Card accent={colors.sky}>
      <View style={cardStyles.connectHeader}>
        <View>
          <Label color={colors.sky}>WITHINGS OAuth</Label>
          <Text style={cardStyles.connectTitle}>
            {connected ? 'Withings connected' : 'Connect Withings'}
          </Text>
        </View>
        {loading ? <ActivityIndicator color={colors.sky} /> : null}
      </View>

      <Text style={widgetStyles.bodyMuted}>
        {connected
          ? 'The backend completed Withings authorization.'
          : 'Sign in with Withings through the backend callback flow.'}
      </Text>

      {errorMessage ? <Text style={cardStyles.connectError}>{errorMessage}</Text> : null}

      <Pressable
        accessibilityRole="button"
        disabled={!isReady || loading}
        onPress={connectWithings}
        style={[
          cardStyles.connectButton,
          { backgroundColor: colors.sky },
          (!isReady || loading) && cardStyles.connectButtonDisabled,
        ]}
      >
        <Text style={cardStyles.connectButtonText}>
          {status === 'syncing'
            ? 'Syncing Withings...'
            : loading
              ? 'Connecting...'
              : connected
                ? 'Reconnect Withings'
                : 'Connect Withings'}
        </Text>
      </Pressable>

      <Text style={cardStyles.redirectHint}>App return: {appRedirectUri}</Text>
    </Card>
  );
}
