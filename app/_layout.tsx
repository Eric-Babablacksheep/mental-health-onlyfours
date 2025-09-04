import CanProvider from "@/components/CanProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import PetDataProvider from "@/components/PetDataProvider";
import PetLastTimestampProvider from "@/components/PetLastTimestampProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <CanProvider>
      <PetDataProvider>
        <PetLastTimestampProvider>{children}</PetLastTimestampProvider>
      </PetDataProvider>
    </CanProvider>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Providers>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </Providers>
    </ThemeProvider>
  );
}
