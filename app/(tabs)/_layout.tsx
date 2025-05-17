import { COLORS } from "@/constants/Colors";
import { Tabs } from "expo-router";
import {
  ChartBar as BarChart2,
  BookOpen,
  Chrome as Home,
  CirclePlus as PlusCircle,
  User,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.core.waxWhite,
        tabBarInactiveTintColor: COLORS.core.seafoamGrey,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          backgroundColor: COLORS.core.midnightSurf,
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Skills",
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="log-session"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButtonContainer}>
              <PlusCircle color={COLORS.core.midnightSurf} size={size + 12} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -10,
    backgroundColor: COLORS.core.waxWhite,
    borderRadius: 30,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabBarLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },
});
