import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { heroStyles as styles } from '@/src/styles/heroStyles';

type ConnectionStatus = 'idle' | 'opening' | 'syncing' | 'connected' | 'error';

type DeviceTag = {
  connected?: boolean;
  label: string;
  onConnect?: () => void;
  status?: ConnectionStatus;
};

export function HeroCard({
  devices = [],
}: {
  devices?: DeviceTag[];
}) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />
      <View style={styles.memberRow}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>-</Text>
        </View>
        <View>
          <Text style={styles.memberName}>--</Text>
          <Text style={styles.memberSub}>--</Text>
        </View>
      </View>
      <View style={styles.deviceTags}>
        {devices.map((device) => {
          const connecting = device.status === 'opening' || device.status === 'syncing';
          const showConnect = !device.connected && Boolean(device.onConnect);

          return (
            <View key={device.label} style={styles.deviceTag}>
              <View style={[styles.liveDot, device.connected && styles.liveDotConnected]} />
              <Text style={styles.deviceTagText}>{device.label}</Text>
              {showConnect ? (
                <Pressable
                  accessibilityLabel={`Connect ${device.label}`}
                  accessibilityRole="button"
                  disabled={connecting}
                  onPress={device.onConnect}
                  style={[styles.deviceConnectButton, connecting && styles.deviceConnectButtonDisabled]}
                >
                  {connecting ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.deviceConnectText}>+</Text>
                  )}
                </Pressable>
              ) : device.connected ? (
                <View style={styles.deviceConnectedBadge}>
                  <Text style={styles.deviceConnectedText}>✓</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.heroFooter}>
        <Text style={styles.heroSync}>Last synced: <Text style={styles.monoWhite}>--</Text></Text>
        <View style={styles.whitePill}>
          <Text style={styles.whitePillText}>-- Active</Text>
        </View>
      </View>
    </View>
  );
}
