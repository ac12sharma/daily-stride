import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const auth = useAuthProvider();

  useEffect(() => {
    if (!auth.loading) SplashScreen.hideAsync();
  }, [auth.loading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthContext.Provider value={auth}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="activity/[id]"
              options={{ animation: "slide_from_right", headerShown: false }}
            />
            <Stack.Screen
              name="profile/[id]"
              options={{ animation: "slide_from_right", headerShown: false }}
            />
            <Stack.Screen
              name="premium"
              options={{ animation: "slide_from_bottom", presentation: "modal" }}
            />
          </Stack>
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
