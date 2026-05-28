import { Text, View } from 'react-native';

import { widgetStyles as styles } from '@/src/styles/widgetStyles';

export function SectionHeader({ color, title, subtitle }: { color: string; title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionRow}>
        <View style={[styles.sectionBar, { backgroundColor: color }]} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionSub}>{subtitle}</Text>
    </View>
  );
}
