import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { dashboardTabs, type TabKey } from '@/src/components/navigation/dashboardTabs';
import { colors } from '@/src/theme/colors';

import { navigationStyles as styles } from '@/src/styles/navigationStyles';

export function BottomNav({
  activeTab,
  onChange,
  onReselect,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  onReselect: () => void;
}) {
  const handlePress = (tab: TabKey) => {
    Haptics.selectionAsync();

    if (tab === activeTab) {
      onReselect();
      return;
    }

    onChange(tab);
  };

  return (
    <View style={styles.bottomNav}>
      {dashboardTabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => handlePress(tab.key)}
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
