import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-meter" />
        <Stack.Screen name="recharge" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="success" />
      </Stack>
    </>
  );
}
