import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppState } from "../stores/AppStateStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { isAppReady, setIsAppReady } = AppState.useAppReadyState();

  // 폰트 로딩 완료 시 앱 준비 상태 업데이트
  useEffect(() => {
    if (loaded) {
      setIsAppReady(true);
    }
  }, [loaded, setIsAppReady]);

  // 앱이 완전히 준비되었을 때 스플래시 스크린 숨기기
  useEffect(() => {
    const hideSplash = async () => {
      if (isAppReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [isAppReady]);

  if (!loaded || !isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaProvider>
  );
}
