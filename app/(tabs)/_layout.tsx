import { COLORS } from "@/constants/Colors";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import {
  ChartBar as BarChart2,
  Chrome as Home,
  LineChart,
  CirclePlus as PlusCircle,
  User,
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define the custom button component here, before TabLayout
const CustomLogButton = (props: BottomTabBarButtonProps) => {
  const { children, onPress } = props;
  const buttonDiameter = 64; // Increased size for the floating circle

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      activeOpacity={0.8}
    >
      <View
        style={{
          position: "absolute",
          top: -22, // Adjust for floating effect (pulls the button up)
          width: buttonDiameter,
          height: buttonDiameter,
          borderRadius: buttonDiameter / 2,
          backgroundColor: COLORS.core.sunsetCoral,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: COLORS.core.boardBlack,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 7, // For Android shadow
          zIndex: 1, // Ensure it's above the tab bar
        }}
      >
        {typeof children === "string" ? (
          <Text style={{ color: COLORS.core.waxWhite }}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // COMPLETELY REBUILT FROM SCRATCH - ONLY WITH TABS WE WANT
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
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {/* Progress Tab */}
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />

      {/* Log Session Tab (center floating button) */}
      <Tabs.Screen
        name="log-session"
        options={{
          title: "Log",
          tabBarLabel: () => null,
          tabBarIcon: ({ size }) => {
            const plusIconSize = size + 12;
            return (
              <PlusCircle color={COLORS.core.waxWhite} size={plusIconSize} />
            );
          },
          tabBarButton: (props) => <CustomLogButton {...props} />,
        }}
      />

      {/* Sessions Tab */}
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color, size }) => (
            <LineChart color={color} size={size} />
          ),
        }}
      />

      {/* Profile Tab */}
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
  tabBarLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },
});
