import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { ProfileStat } from '@/components/profile/ProfileStat';
import { AchievementCard } from '@/components/profile/AchievementCard';
import { MOCK_USER, MOCK_ACHIEVEMENTS } from '@/data/mockData';
import { Settings, Award, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color={COLORS.text.primary} size={24} />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: MOCK_USER.profileImage }}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.profileName}>{MOCK_USER.firstName} {MOCK_USER.lastName}</Text>
            <Text style={styles.profileBio}>{MOCK_USER.bio}</Text>
            
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {MOCK_USER.level}</Text>
            </View>

            <View style={styles.statsContainer}>
              <ProfileStat label="Sessions" value={MOCK_USER.totalSessions.toString()} />
              <View style={styles.statDivider} />
              <ProfileStat label="Hours" value={MOCK_USER.totalHours.toString()} />
              <View style={styles.statDivider} />
              <ProfileStat label="Skills" value={`${MOCK_USER.skillsMastered}/${MOCK_USER.totalSkills}`} />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award color={COLORS.accent[600]} size={20} />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsContainer}
            >
              {MOCK_ACHIEVEMENTS.map((achievement, index) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  delay={index * 100}
                />
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.settingsOption}>
              <Text style={styles.settingsOptionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsOption}>
              <Text style={styles.settingsOptionText}>Notification Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsOption}>
              <Text style={styles.settingsOptionText}>App Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsOption}>
              <Text style={styles.settingsOptionText}>Help & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsOption, styles.logoutOption]}>
              <LogOut color={COLORS.error[600]} size={20} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
  },
  settingsButton: {
    padding: 8,
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary[500],
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  profileBio: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: COLORS.primary[500],
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  levelText: {
    ...TYPOGRAPHY.buttonText,
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.neutral[200],
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  achievementsContainer: {
    paddingBottom: 8,
  },
  settingsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 100,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  settingsOptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  logoutText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error[600],
    marginLeft: 8,
  },
});