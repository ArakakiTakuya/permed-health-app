import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { formatLastSyncedAt } from '@/src/data/healthFormatters';
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
  lastSyncedAt,
  memberEmail,
  memberName,
}: {
  devices?: DeviceTag[];
  lastSyncedAt?: Date | null;
  memberEmail?: string | null;
  memberName?: string | null;
}) {
  const displayName = getDisplayName(memberName, memberEmail);
  const displayInitial = displayName === '--' ? '-' : displayName.charAt(0).toUpperCase();
  const activeDeviceCount = devices.filter((device) => device.connected).length;
  const activeDeviceText = `${activeDeviceCount}/${devices.length} Active`;
  const lastSyncedLabel = formatLastSyncedAt(lastSyncedAt).replace('Last synced: ', '');

  return (
    <View style={styles.hero}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />
      <View style={styles.memberRow}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>{displayInitial}</Text>
        </View>
        <View>
          <Text style={styles.memberName}>{displayName}</Text>
          <Text style={styles.memberSub}>{memberEmail ?? '--'}</Text>
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
        <Text style={styles.heroSync}>Last synced: <Text style={styles.monoWhite}>{lastSyncedLabel}</Text></Text>
        <View style={styles.whitePill}>
          <Text style={styles.whitePillText}>{activeDeviceText}</Text>
        </View>
      </View>
    </View>
  );
}

function getDisplayName(name?: string | null, email?: string | null) {
  if (name) {
    return name;
  }

  if (email) {
    return email.split('@')[0] || email;
  }

  return '--';
}
