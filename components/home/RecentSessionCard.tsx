import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { Session } from "@/types";
import { formatDate } from "@/utils/helpers";
import { CalendarDays, MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecentSessionCardProps {
  session: Session;
}

export const RecentSessionCard: React.FC<RecentSessionCardProps> = ({
  session,
}) => {
  // Function to determine star color based on rating
  const getStarColor = (rating: number, starPosition: number) => {
    if (starPosition <= rating) {
      return COLORS.accent[500];
    }
    return COLORS.neutral[300];
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={COLORS.text.secondary} />
          <Text style={styles.location}>{session.location}</Text>
        </View>
        <View style={styles.dateContainer}>
          <CalendarDays size={16} color={COLORS.text.secondary} />
          <Text style={styles.date}>
            {formatDate(new Date(session.date)).formattedDate}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{session.duration}h</Text>
        </View>
        <View style={styles.statDivider} />
        {session.waveHeight && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Wave Height</Text>
            <Text style={styles.statValue}>{session.waveHeight.label}</Text>
          </View>
        )}
        {/* Wind speed removed from Session type, add back if needed */}
        {/* <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Wind</Text>
          <Text style={styles.statValue}>{session.windSpeed}km/h</Text>
        </View> */}
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text
              key={star}
              style={[
                styles.starIcon,
                { color: getStarColor(session.overallRating || 0, star) },
              ]}
            >
              ★
            </Text>
          ))}
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: COLORS.neutral[100],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  starIcon: {
    fontSize: 18,
    marginRight: 2,
  },
  detailsButton: {
    backgroundColor: COLORS.primary[100],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary[600],
  },
});
