import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInRight,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { Achievement } from '@/types';

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement,
  delay = 0
}) => {
  const rotate = useSharedValue(0);
  
  useEffect(() => {
    rotate.value = withTiming(360, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotate.value}deg` }],
    };
  });

  return (
    <Animated.View 
      style={[styles.container]} 
      entering={FadeInRight.delay(300 + delay).duration(500)}
    >
      <Animated.View style={[styles.badgeContainer, animatedStyle]}>
        <Text style={styles.badgeEmoji}>{achievement.icon}</Text>
      </Animated.View>
      <Text style={styles.title}>{achievement.title}</Text>
      <Text style={styles.date}>{achievement.dateEarned}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
  },
  badgeContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeEmoji: {
    fontSize: 30,
  },
  title: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    fontSize: 10,
  },
});