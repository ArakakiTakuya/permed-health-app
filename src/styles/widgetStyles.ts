import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';

export const widgetStyles = StyleSheet.create({
  sectionHeader: {
    marginTop: 2,
    marginBottom: -2,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '700',
  },
  sectionSub: {
    marginLeft: 11,
    marginTop: 2,
    color: colors.faint,
    fontSize: 12,
  },
  label: {
    marginBottom: 7,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  metricValue: {
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 40,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '500',
  },
  microMuted: {
    color: colors.faint,
    fontSize: 10,
  },
  largeNumber: {
    fontSize: 36,
    fontWeight: '300',
  },
  bodyMuted: {
    color: colors.faint,
    fontSize: 12,
  },
  boldViolet: {
    color: colors.violet,
    fontWeight: '800',
  },
  sleepChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sleepValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  sleepLabel: {
    marginTop: 3,
    color: '#ffffff',
    opacity: 0.82,
    fontSize: 9,
    fontWeight: '800',
  },
  infoBox: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#f2fbfa',
  },
  infoLabel: {
    color: colors.faint,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  range: {
    marginTop: 8,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rangeLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  rangeValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  rangeTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  rangeFill: {
    height: '100%',
    borderRadius: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
  legendLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  legendValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: '#ffffff',
    opacity: 0.7,
    fontSize: 10,
  },
  heroStatValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
