import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { SkillCategory } from '@/types';
import { ChevronRight } from 'lucide-react-native';

interface SkillCategoryCardProps {
  category: SkillCategory;
  onPress: () => void;
}

export const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ 
  category, 
  onPress 
}) => {
  const progressPercentage = (category.completedSkills / category.totalSkills) * 100;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
          <Text style={styles.iconText}>{category.icon}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{category.name}</Text>
            <Text style={styles.count}>
              {category.completedSkills}/{category.totalSkills}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progressPercentage}%` },
                { backgroundColor: category.color }
              ]} 
            />
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {category.description}
          </Text>
        </View>
      </View>
      
      <ChevronRight size={20} color={COLORS.neutral[400]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  count: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
});