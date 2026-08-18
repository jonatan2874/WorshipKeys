import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function BienvenidaScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();

  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch {
      // sin sesión nativa disponible (p. ej. vista previa web) — se sigue
      // igual como invitado, el aviso ya se explica en Perfil.
    }
    router.replace('/');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.top}>
          <ThemedText type="label" style={{ color: theme.accentStrong }}>
            {t('bienvenida.eyebrow')}
          </ThemedText>
          <ThemedText type="title" style={styles.headline}>
            {t('bienvenida.headline')}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.pitch}>
            {t('bienvenida.pitch')}
          </ThemedText>
        </View>

        <View style={styles.bottom}>
          <PressButton label={t('bienvenida.start')} onPress={() => router.push('/onboarding-nivel')} />
          <PressButton label={t('bienvenida.haveAccount')} onPress={handleSignIn} variant="secondary" style={{ marginTop: Spacing.two }} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.six,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  top: { gap: Spacing.two },
  headline: { fontSize: 32, lineHeight: 38 },
  pitch: { lineHeight: 22, marginTop: Spacing.two, maxWidth: 320 },
  bottom: {},
});
