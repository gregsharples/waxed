import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected ? styles.selectedChip : {}
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.chipText,
          isSelected ? styles.selectedChipText : {}
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.neutral[100],
  },
  selectedChip: {
    backgroundColor: COLORS.primary[600],
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  selectedChipText: {
    color: 'white',
  },
});