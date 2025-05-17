import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface RatingPickerProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingPicker: React.FC<RatingPickerProps> = ({
  rating,
  onRatingChange,
}) => {
  const scale = useSharedValue(1);

  const handlePress = (newRating: number) => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
    onRatingChange(newRating);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Get the rating description
  const getRatingDescription = () => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Average";
      case 3:
        return "Good";
      case 4:
        return "Great";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handlePress(star)}
            style={styles.starButton}
          >
            <Animated.Text
              style={[
                styles.star,
                star <= rating && styles.filledStar,
                star === rating && animatedStyle,
              ]}
            >
              ★
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>{getRatingDescription()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 4, // Reduced marginVertical from 8 to 4
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 36,
    color: COLORS.neutral[200],
  },
  filledStar: {
    color: COLORS.core.sunsetCoral,
  },
  ratingText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.core.sunsetCoral, // Changed to sunsetCoral
    marginTop: 4, // Reduced marginTop to 4
  },
});
