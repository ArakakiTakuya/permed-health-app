import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';

export const heroStyles = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  heroGlowTop: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroGlowBottom: {
    position: 'absolute',
    right: 20,
    bottom: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  memberAvatar: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  memberAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 20,
  },
  memberName: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '700',
  },
  memberSub: {
    color: '#ffffff',
    opacity: 0.82,
    fontSize: 11,
    marginTop: 2,
  },
  deviceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  deviceTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  deviceTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  heroFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopColor: 'rgba(255,255,255,0.22)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroSync: {
    color: '#ffffff',
    opacity: 0.82,
    fontSize: 11,
  },
  monoWhite: {
    fontWeight: '700',
  },
  whitePill: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  whitePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  recoveryStatusPill: {
    marginTop: 6,
  },
  violetHero: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.violet,
  },
  recoveryHero: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  heroLabel: {
    color: '#ffffff',
    opacity: 0.75,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroNumber: {
    color: '#ffffff',
    fontSize: 46,
    fontWeight: '300',
    lineHeight: 52,
  },
  heroText: {
    color: '#ffffff',
    opacity: 0.86,
    fontSize: 12,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: '800',
  },
  microWhite: {
    color: '#ffffff',
    opacity: 0.75,
    fontSize: 10,
    marginBottom: 6,
  },
  recoveryNumber: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: '300',
    lineHeight: 60,
  },
  heroStats: {
    alignItems: 'flex-end',
    gap: 14,
  },
});
