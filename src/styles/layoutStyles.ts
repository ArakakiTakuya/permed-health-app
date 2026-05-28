import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';

export const layoutStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  appShell: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 118,
  },
  panel: {
    gap: 16,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  grid3: {
    flexDirection: 'row',
    gap: 10,
  },
  grid4: {
    flexDirection: 'row',
    gap: 8,
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  rightMetric: {
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
  },
  centerMetric: {
    alignItems: 'center',
  },
  ringRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  compositionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  legendList: {
    flex: 1,
    gap: 10,
  },
});
