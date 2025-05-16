import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';

interface ProfileStatProps {
  label: string;
  value: string;
}

export const ProfileStat: React.FC<ProfileStatProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
});