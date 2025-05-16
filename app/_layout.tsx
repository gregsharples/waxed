import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Session } from "@supabase/supabase-js"; // Added
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react"; // Added useState
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto"; // Added
import Auth from "../components/Auth"; // Added
import { supabase } from "../lib/supabase"; // Added

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null); // Added session state
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Added useEffect for Supabase auth
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      // Renamed session to currentSession to avoid conflict
      setSession(currentSession);
    });

    supabase.auth.onAuthStateChange((_event, currentSession) => {
      // Renamed session to currentSession
      setSession(currentSession);
    });
  }, []);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // If no session, show Auth component. Otherwise, show the main app.
  if (!session) {
    return <Auth />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
