import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { supabase } from "@/lib/supabase";
import { Session } from "@/types";
import { Calendar, Clock, MapPin, Waves } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessionsScreen() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    avgRating: 0,
    frequentLocations: [] as { location: string; count: number }[],
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          "Authentication Error",
          "Please log in to view your sessions."
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setSessions(data);
        calculateStats(data);
      }
    } catch (error: any) {
      console.error("Error fetching sessions:", error.message);
      Alert.alert("Error", `Failed to load sessions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: any[]) => {
    // Calculate total sessions
    const totalSessions = data.length;

    // Calculate total time spent surfing
    const totalMinutes = data.reduce(
      (sum, session) => sum + (session.duration_minutes || 0),
      0
    );

    // Calculate average rating
    const sessionWithRatings = data.filter((session) => session.rating > 0);
    const avgRating =
      sessionWithRatings.length > 0
        ? sessionWithRatings.reduce((sum, session) => sum + session.rating, 0) /
          sessionWithRatings.length
        : 0;

    // Find most frequent locations
    const locationCounts: { [key: string]: number } = {};
    data.forEach((session) => {
      const location = session.location;
      if (location) {
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });

    const frequentLocations = Object.keys(locationCounts)
      .map((location) => ({ location, count: locationCounts[location] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3 locations

    setStats({
      totalSessions,
      totalMinutes,
      avgRating,
      frequentLocations,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${mins} min`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sessions</Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.core.sunsetCoral} />
          </View>
        ) : (
          <>
            {/* Stats Overview */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Your Stats</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Calendar size={24} color={COLORS.core.midnightSurf} />
                    <Text style={styles.statValue}>{stats.totalSessions}</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Clock size={24} color={COLORS.core.midnightSurf} />
                    <Text style={styles.statValue}>
                      {formatDuration(stats.totalMinutes)}
                    </Text>
                    <Text style={styles.statLabel}>Surf Time</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.starRating}>
                      {renderRatingStars(Math.round(stats.avgRating))}
                    </Text>
                    <Text style={styles.statLabel}>Avg Rating</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Frequent Locations */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Favorite Spots</Text>
                {stats.frequentLocations.length > 0 ? (
                  stats.frequentLocations.map((location, index) => (
                    <View key={index} style={styles.locationItem}>
                      <MapPin
                        size={20}
                        color={COLORS.text.secondary}
                        style={styles.locationIcon}
                      />
                      <Text style={styles.locationName}>
                        {location.location}
                      </Text>
                      <Text style={styles.locationCount}>
                        {location.count} sessions
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    No locations recorded yet
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* Recent Sessions */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Sessions</Text>
                {sessions.length > 0 ? (
                  sessions.slice(0, 5).map((session, index) => (
                    <View key={index} style={styles.sessionItem}>
                      <View style={styles.sessionHeader}>
                        <Text style={styles.sessionDate}>
                          {formatDate(session.date)}
                        </Text>
                        <Text style={styles.sessionRating}>
                          {session.rating
                            ? renderRatingStars(session.rating)
                            : "Not rated"}
                        </Text>
                      </View>
                      <View style={styles.sessionDetails}>
                        <View style={styles.sessionDetailItem}>
                          <MapPin
                            size={16}
                            color={COLORS.text.secondary}
                            style={styles.detailIcon}
                          />
                          <Text style={styles.detailText}>
                            {session.location}
                          </Text>
                        </View>
                        <View style={styles.sessionDetailItem}>
                          <Clock
                            size={16}
                            color={COLORS.text.secondary}
                            style={styles.detailIcon}
                          />
                          <Text style={styles.detailText}>
                            {formatDuration(session.duration_minutes || 0)}
                          </Text>
                        </View>
                        {session.wave_height && (
                          <View style={styles.sessionDetailItem}>
                            <Waves
                              size={16}
                              color={COLORS.text.secondary}
                              style={styles.detailIcon}
                            />
                            <Text style={styles.detailText}>
                              {session.wave_height}
                            </Text>
                          </View>
                        )}
                      </View>
                      {session.notes && (
                        <Text style={styles.sessionNotes} numberOfLines={2}>
                          {session.notes}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No sessions recorded yet</Text>
                )}

                {sessions.length > 5 && (
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All Sessions</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>

            {/* Pull to refresh hint */}
            {sessions.length > 0 && (
              <Text style={styles.refreshHint}>Pull down to refresh</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
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
  loaderContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginTop: 8,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  starRating: {
    fontSize: 18,
    color: COLORS.core.sunsetCoral,
    marginTop: 4,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  locationIcon: {
    marginRight: 8,
  },
  locationName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    flex: 1,
  },
  locationCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  sessionItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    paddingVertical: 12,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sessionDate: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  sessionRating: {
    fontSize: 16,
    color: COLORS.core.sunsetCoral,
  },
  sessionDetails: {
    marginVertical: 4,
  },
  sessionDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  sessionNotes: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 8,
    fontStyle: "italic",
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: "center",
    paddingVertical: 20,
  },
  viewAllButton: {
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
  },
  viewAllText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.text.primary,
  },
  refreshHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
});
