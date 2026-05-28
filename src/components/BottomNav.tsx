import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { dashboardTabs, type TabKey } from '@/src/data/dashboardData';
import { colors } from '@/src/theme/colors';

import { navigationStyles as styles } from '@/src/styles/navigationStyles';

export function BottomNav({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <View style={styles.bottomNav}>
      {dashboardTabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={[styles.navButton, active && styles.navButtonActive]}
          >
            <Ionicons
              name={tab.icon}
              size={21}
              color={active ? colors.primary : colors.faint}
            />
            <Text style={[styles.navLabel, active && styles.navLabelActive]}>{tab.label}</Text>
            <View style={[styles.navDot, active && styles.navDotActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}
