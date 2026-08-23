import { Baloo2_500Medium, Baloo2_600SemiBold, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppSettingsProvider } from '@/contexts/app-settings';
import { AuthProvider } from '@/contexts/auth-context';
import { OnboardingProvider, useOnboarding } from '@/contexts/onboarding-context';
import { ProgressProvider } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import '@/lib/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
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
          <OnboardingProvider>
            <RootLayoutNavigator />
          </OnboardingProvider>
        </ProgressProvider>
      </AuthProvider>
    </AppSettingsProvider>
  );
}

function RootLayoutNavigator() {
  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { complete, loading } = useOnboarding();

  // Primera vez (onboarding no completado): manda a bienvenida en vez de
  // Inicio. Si ya está completo pero de algún modo se cae en bienvenida
  // (p. ej. un enlace viejo, u otra pestaña lo completó), lo manda de
  // vuelta a Inicio — el gate funciona en ambos sentidos. En web
  // AsyncStorage no persiste (limitación ya conocida de la vista previa
  // web, igual que el progreso), así que ahí siempre se ve el onboarding —
  // no bloquea la app nativa real.
  useEffect(() => {
    if (loading) return;
    const inOnboardingFlow = segments[0] === 'bienvenida' || segments[0] === 'onboarding-nivel';
    if (!complete && !inOnboardingFlow) {
      router.replace('/bienvenida');
    } else if (complete && inOnboardingFlow) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, complete]);

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="leccion" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        <Stack.Screen name="bienvenida" />
        <Stack.Screen name="onboarding-nivel" />
      </Stack>
    </>
  );
}
