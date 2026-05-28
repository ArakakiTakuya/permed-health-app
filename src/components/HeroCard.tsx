import { Text, View } from 'react-native';

import { heroStyles as styles } from '@/src/styles/heroStyles';

export function HeroCard() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />
      <View style={styles.memberRow}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>A</Text>
        </View>
        <View>
          <Text style={styles.memberName}>Alexander Cha</Text>
          <Text style={styles.memberSub}>PM-0042 · Active Member</Text>
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
        <Text style={styles.heroSync}>Last synced: <Text style={styles.monoWhite}>Today 08:42</Text></Text>
        <View style={styles.whitePill}>
          <Text style={styles.whitePillText}>3/3 Active</Text>
        </View>
      </View>
    </View>
  );
}
