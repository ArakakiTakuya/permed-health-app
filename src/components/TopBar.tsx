import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { navigationStyles as styles } from '@/src/styles/navigationStyles';

export function TopBar() {
  return (
    <View style={styles.topbar}>
      <View style={styles.brandRow}>
        <View style={styles.logoMark}>
          <Ionicons name="medical" size={17} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.logoText}>
            PerMed <Text style={styles.logoAccent}>Care</Text>
          </Text>
          <Text style={styles.logoSub}>HEALTH DASHBOARD</Text>
        </View>
      </View>
    </View>
  );
}
