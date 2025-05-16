import { StyleSheet } from 'react-native';
import { COLORS } from './Colors';

export const TYPOGRAPHY = StyleSheet.create({
  h1: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  h3: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  overline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});