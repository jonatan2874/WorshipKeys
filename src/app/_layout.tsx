import { Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppSettingsProvider } from '@/contexts/app-settings';
import { AuthProvider } from '@/contexts/auth-context';
import { ProgressProvider } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import '@/lib/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppSettingsProvider>
      <AuthProvider>
        <ProgressProvider>
          <RootLayoutNavigator />
        </ProgressProvider>
      </AuthProvider>
    </AppSettingsProvider>
  );
}

function RootLayoutNavigator() {
  const theme = useTheme();

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="leccion" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
