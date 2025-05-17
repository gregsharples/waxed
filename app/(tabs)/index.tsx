import { WaveProgressBar } from "@/components/common/WaveProgressBar";
import { RecentSessionCard } from "@/components/home/RecentSessionCard";
import { StatCard } from "@/components/home/StatCard";
import { UpcomingSessionCard } from "@/components/home/UpcomingSessionCard";
import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import {
  MOCK_RECENT_SESSIONS,
  MOCK_UPCOMING_SESSIONS,
  MOCK_USER,
} from "@/data/mockData";
import { getGreeting } from "@/utils/helpers";
import React, { useRef } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);

  // const userLevel = MOCK_USER.level;
  // const userProgress = MOCK_USER.levelProgress;
  // const userName = MOCK_USER.firstName;
  const userLevel = "1"; // Placeholder
  const userProgress = 0.5; // Placeholder
  const userName = MOCK_USER.email ? MOCK_USER.email.split("@")[0] : "Surfer"; // Use email part or generic

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeIn.delay(100).duration(600)}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {userName}
              </Text>
              <Text style={styles.subtitle}>Ready to catch some waves?</Text>
            </View>
            {/* <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: MOCK_USER.profileImage }}
                style={styles.profileImage}
              />
            </View> */}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <View style={styles.levelContainer}>
            <View style={styles.levelTextContainer}>
              <Text style={styles.levelLabel}>Current Level</Text>
              <Text style={styles.levelValue}>{userLevel}</Text>
            </View>
            <View style={styles.progressContainer}>
              <WaveProgressBar progress={userProgress} />
              <Text style={styles.progressText}>
                {Math.round(userProgress * 100)}% to Level{" "}
                {parseInt(userLevel) + 1}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <View style={styles.statsContainer}>
            <StatCard
              title="Total Sessions"
              // value={MOCK_USER.totalSessions.toString()}
              value={"0"}
              icon="calendar"
              color={COLORS.primary[500]}
            />
            <StatCard
              title="Hours Surfed"
              // value={MOCK_USER.totalHours.toString()}
              value={"0"}
              icon="clock"
              color={COLORS.secondary[500]}
            />
            <StatCard
              title="Skills Mastered"
              // value={`${MOCK_USER.skillsMastered}/${MOCK_USER.totalSkills}`}
              value={"0/0"}
              icon="award"
              color={COLORS.accent[500]}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.upcomingSessionsContainer}
          >
            {MOCK_UPCOMING_SESSIONS.map((session, index) => (
              <UpcomingSessionCard
                key={session.id}
                session={session}
                index={index}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {MOCK_RECENT_SESSIONS.map((session, index) => (
            <RecentSessionCard key={session.id} session={session} />
          ))}
        </Animated.View>
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    color: COLORS.core.boardBlack,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.core.boardBlack,
    marginTop: 4,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: COLORS.neutral[100],
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  levelContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.secondary,
  },
  levelValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary[600],
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  seeAllText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primary[600],
  },
  upcomingSessionsContainer: {
    paddingBottom: 8,
  },
});
