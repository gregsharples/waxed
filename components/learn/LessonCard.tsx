import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { Play, Clock } from 'lucide-react-native';
import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: lesson.thumbnail }}
          style={styles.thumbnail}
        />
        <View style={styles.playButton}>
          <Play size={16} color="white" fill="white" />
        </View>
        <View style={styles.durationBadge}>
          <Clock size={12} color="white" />
          <Text style={styles.durationText}>{lesson.duration}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.categoryContainer}>
            {lesson.categories.slice(0, 2).map((category, index) => (
              <View 
                key={index} 
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(category) }
                ]}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
            {lesson.categories.length > 2 && (
              <Text style={styles.moreText}>+{lesson.categories.length - 2} more</Text>
            )}
          </View>
          
          <Text style={styles.instructorText}>
            with {lesson.instructor}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Beginner':
      return COLORS.primary[100];
    case 'Intermediate':
      return COLORS.secondary[100];
    case 'Advanced':
      return COLORS.accent[100];
    case 'Technique':
      return COLORS.success[100];
    case 'Safety':
      return COLORS.warning[100];
    default:
      return COLORS.neutral[100];
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnailContainer: {
    height: 160,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    ...TYPOGRAPHY.caption,
    color: 'white',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
  },
  moreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  instructorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
});