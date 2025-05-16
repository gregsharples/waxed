import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming,
  Easing 
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  percentage, 
  size = 150, 
  strokeWidth = 15 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);
  
  useEffect(() => {
    animatedProgress.value = withTiming(percentage / 100, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={COLORS.neutral[100]}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={COLORS.primary[500]}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      
      <View style={[styles.percentageContainer, { width: size, height: size }]}>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        <Text style={styles.label}>Complete</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary[600],
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
});