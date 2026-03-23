import { Stack } from 'expo-router';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View } from 'react-native';
import { colors } from '../theme/colors';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.primary, backgroundColor: '#FFF' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '500',
        color: colors.text
      }}
      text2Style={{
        fontSize: 13,
        color: colors.textSecondary
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15,
        fontWeight: '500'
      }}
      text2Style={{
        fontSize: 13
      }}
    />
  )
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <View style={{ zIndex: 9999, elevation: 9999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'box-none' }}>
        <Toast config={toastConfig} position="top" topOffset={60} />
      </View>
    </>
  );
}
