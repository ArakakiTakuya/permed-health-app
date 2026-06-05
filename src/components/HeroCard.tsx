import { Text, View } from 'react-native';

import { heroStyles as styles } from '@/src/styles/heroStyles';

export function HeroCard() {
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
        {['WHOOP', 'Withings', 'Lingo CGM'].map((device) => (
          <View key={device} style={styles.deviceTag}>
            <View style={styles.liveDot} />
            <Text style={styles.deviceTagText}>{device}</Text>
          </View>
        ))}
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
