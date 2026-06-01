import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';

export const chartStyles = StyleSheet.create({
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScore: {
    position: 'absolute',
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  ringLabel: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chart: {
    height: 92,
    marginTop: 8,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  chartTall: {
    height: 148,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartStem: {
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  chartDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: -4,
  },
  donut: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetLight,
    overflow: 'hidden',
  },
  donutSlice: {
    position: 'absolute',
    height: 16,
    borderRadius: 8,
    left: 10,
  },
  donutText: {
    color: colors.violet,
    fontSize: 22,
    fontWeight: '800',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compositionDonut: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: '#f2fbfa',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  compositionBand: {
    position: 'absolute',
    left: 4,
    height: 22,
    borderRadius: 11,
  },
  barChart: {
    height: 148,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 6,
    borderWidth: 1,
  },
  barLabel: {
    marginTop: 6,
    color: colors.faint,
    fontSize: 10,
    fontWeight: '800',
  },
});
