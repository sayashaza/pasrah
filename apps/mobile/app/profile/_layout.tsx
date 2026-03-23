import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="about" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="address" />
      <Stack.Screen name="cards" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
