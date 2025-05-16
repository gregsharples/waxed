import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInRight
} from 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { Droplet, Wind, MapPin } from 'lucide-react-native';
import { formatDate } from '@/utils/helpers';
import { Session } from '@/types';

interface UpcomingSessionCardProps {
  session: Session;
  index: number;
}

export const UpcomingSessionCard: React.FC<UpcomingSessionCardProps> = ({ session, index }) => {
  const translateY = useSharedValue(10);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]} 
      entering={FadeInRight.delay(300 + index * 100).duration(500)}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{formatDate(new Date(session.date)).day}</Text>
        <Text style={styles.month}>{formatDate(new Date(session.date)).month}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{session.location}</Text>
        <Text style={styles.time}>{formatDate(new Date(session.date)).time}</Text>
        
        <View style={styles.conditionsContainer}>
          <View style={styles.conditionItem}>
            <Droplet size={14} color={COLORS.secondary[600]} />
            <Text style={styles.conditionText}>{session.waveHeight}m</Text>
          </View>
          <View style={styles.conditionItem}>
            <Wind size={14} color={COLORS.accent[600]} />
            <Text style={styles.conditionText}>{session.windSpeed}km/h</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  dateContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  day: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary[600],
  },
  month: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary[600],
    textTransform: 'uppercase',
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  time: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  conditionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  conditionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[50],
  },
  buttonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary[600],
  },
});