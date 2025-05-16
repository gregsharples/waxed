import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { LessonCard } from '@/components/learn/LessonCard';
import { FilterChip } from '@/components/common/FilterChip';
import { MOCK_LESSONS } from '@/data/mockData';

const CATEGORIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Technique', 'Safety'];

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredLessons = selectedCategory === 'All' 
    ? MOCK_LESSONS
    : MOCK_LESSONS.filter(lesson => lesson.categories.includes(selectedCategory));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        <Text style={styles.subtitle}>Improve your skills with our curated lessons</Text>
      </View>

      <Animated.View entering={FadeIn.delay(200).duration(600)}>
        <View style={styles.featuredContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg' }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredOverlayText}>FEATURED</Text>
            <Text style={styles.featuredTitle}>Master the Pop-Up</Text>
            <Text style={styles.featuredSubtitle}>A Fundamental Skill Every Surfer Needs</Text>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <FlatList
          horizontal
          data={CATEGORIES}
          renderItem={({ item }) => (
            <FilterChip
              label={item}
              isSelected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
            />
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </Animated.View>

      <FlatList
        data={filteredLessons}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(400 + index * 100).duration(600)}>
            <LessonCard lesson={item} />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lessonsContainer}
      />
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
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  featuredContainer: {
    margin: 16,
    borderRadius: 16,
    height: 200,
    overflow: 'hidden',
    backgroundColor: COLORS.neutral[100],
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredOverlayText: {
    ...TYPOGRAPHY.overline,
    color: COLORS.primary[300],
    marginBottom: 8,
  },
  featuredTitle: {
    ...TYPOGRAPHY.h2,
    color: 'white',
  },
  featuredSubtitle: {
    ...TYPOGRAPHY.subtitle,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  featuredButton: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  featuredButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: 'white',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  lessonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});