import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';

export const navigationStyles = StyleSheet.create({
  topbar: {
    height: 54,
    paddingHorizontal: 18,
    backgroundColor: colors.bg,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
  },
  logoAccent: {
    color: colors.primary,
  },
  logoSub: {
    marginTop: 1,
    fontSize: 9,
    color: colors.faint,
    fontWeight: '800',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    minHeight: 58,
  },
  navButtonActive: {
    backgroundColor: '#f2fbfa',
  },
  navLabel: {
    marginTop: 3,
    color: colors.faint,
    fontSize: 9,
    fontWeight: '800',
  },
  navLabelActive: {
    color: colors.primary,
  },
  navDot: {
    marginTop: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  navDotActive: {
    backgroundColor: colors.primary,
  },
});
