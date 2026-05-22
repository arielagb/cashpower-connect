import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function RootLayout() {
  StatusBar.setBarStyle("light-content");
  StatusBar.setBackgroundColor("#0D5C3A");
  StatusBar.setTranslucent(false);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-meter" />
        <Stack.Screen name="recharge" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="success" />
      </Stack>
    </SafeAreaProvider>
  );
}