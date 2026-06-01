import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';

export const cardStyles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  scoreTitle: {
    marginBottom: 12,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  metricSub: {
    marginTop: 4,
    color: colors.faint,
    fontSize: 11,
  },
  statRow: {
    paddingVertical: 10,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  connectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  connectTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  connectError: {
    color: colors.rose,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  connectButton: {
    marginTop: 14,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  connectButtonDisabled: {
    opacity: 0.45,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  redirectHint: {
    marginTop: 10,
    color: colors.faint,
    fontSize: 10,
  },
});
