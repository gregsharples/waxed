import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface WaveProgressBarProps {
  progress: number; // 0 to 1
}

export const WaveProgressBar: React.FC<WaveProgressBarProps> = ({ progress }) => {
  const translateX = useSharedValue(0);
  const fillWidth = width * 0.9 * progress; // 90% of screen width times progress

  // Wave animation
  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const waveStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressTrack]}>
        <View style={[styles.progressFill, { width: fillWidth }]}>
          <Animated.View style={[styles.wave, waveStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  progressTrack: {
    height: 20,
    width: '100%',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    top: -8,
    left: -20,
    right: -20,
    height: 100,
    backgroundColor: COLORS.primary[500],
    borderRadius: 50,
  },
});