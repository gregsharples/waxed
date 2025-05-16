import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { SkillCategoryCard } from '@/components/skills/SkillCategoryCard';
import { ProgressChart } from '@/components/skills/ProgressChart';
import { MOCK_SKILL_CATEGORIES, MOCK_USER } from '@/data/mockData';

export default function ProgressScreen() {
  const skillsMastered = MOCK_USER.skillsMastered;
  const totalSkills = MOCK_USER.totalSkills;
  const progressPercentage = (skillsMastered / totalSkills) * 100;
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
        </View>

        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewTitle}>Skills Mastery</Text>
            <View style={styles.chartContainer}>
              <ProgressChart percentage={progressPercentage} />
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{skillsMastered}</Text>
                  <Text style={styles.statLabel}>Skills Mastered</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalSkills - skillsMastered}</Text>
                  <Text style={styles.statLabel}>Skills To Go</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Skill Categories</Text>
          
          {MOCK_SKILL_CATEGORIES.map((category, index) => (
            <Animated.View key={category.id} entering={FadeInRight.delay(300 + index * 100).duration(600)}>
              <SkillCategoryCard 
                category={category}
                onPress={() => {}} 
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary[600],
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statDivider: {
    height: 40,
    width: 1,
    backgroundColor: COLORS.neutral[200],
  },
  categoriesSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginVertical: 16,
  },
});