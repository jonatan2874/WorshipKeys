import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { SkillLevel, useOnboarding } from '@/contexts/onboarding-context';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';

// Etapas 0-1 (postura, notas): quien ya sabe lo básico no necesita repasarlas.
const SKIP_BASICO = ['lvl-0a-teoria-fundamentos', 'lvl-1a-notas-derecha', 'lvl-1b-notas-izquierda', 'lvl-1c-melodia'];

// Además de lo anterior, Etapas 2-6 (todos los acordes, inversiones,
// escalas): quien "toca con soltura" ya las conoce. Etapa 7 (Tonalidades)
// es la más avanzada con contenido real hoy — cuando se construyan Ritmo,
// Oído y Repertorio, este punto de partida puede subir.
const SKIP_SOLTURA = [
  ...SKIP_BASICO,
  'lvl-2a-teoria-acordes', 'lvl-2b-practica-derecha', 'lvl-2c-practica-izquierda',
  'lvl-3a-teoria-menores', 'lvl-3b-menores-derecha', 'lvl-3c-menores-izquierda',
  'lvl-4a-teoria-sostenidos', 'lvl-4b-sostenidos-derecha', 'lvl-4c-sostenidos-izquierda',
  'lvl-5a-teoria-inversiones', 'lvl-5b-inversiones-derecha', 'lvl-5c-inversiones-izquierda',
  'lvl-6a-teoria-escalas', 'lvl-6b-escalas-derecha', 'lvl-6c-escalas-izquierda',
];

const SKIP_AHEAD_LEVEL_IDS: Record<SkillLevel, string[]> = {
  nunca: [],
  basico: SKIP_BASICO,
  soltura: SKIP_SOLTURA,
};

const SKILL_LEVELS: { value: SkillLevel; labelKey: string; descKey: string }[] = [
  { value: 'nunca', labelKey: 'onboarding.skillNever', descKey: 'onboarding.skillNeverDesc' },
  { value: 'basico', labelKey: 'onboarding.skillBasic', descKey: 'onboarding.skillBasicDesc' },
  { value: 'soltura', labelKey: 'onboarding.skillFluent', descKey: 'onboarding.skillFluentDesc' },
];

const GOALS = ['onboarding.goalChurch', 'onboarding.goalFamily', 'onboarding.goalHymns', 'onboarding.goalPersonal'];

export default function OnboardingNivelScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { completeOnboarding } = useOnboarding();
  const { markLevelsCompleted } = useProgress();
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('nunca');
  const [goals, setGoals] = useState<string[]>([GOALS[0]]);

  function toggleGoal(key: string) {
    setGoals((prev) => (prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]));
  }

  function handleCreate() {
    completeOnboarding(skillLevel, goals);
    // No es una prueba de ubicación real (nadie tocó nada todavía) — es un
    // salto por autoevaluación, para no obligar a alguien que ya sabe tocar
    // a repasar la postura y las notas básicas desde cero.
    markLevelsCompleted(SKIP_AHEAD_LEVEL_IDS[skillLevel]);
    router.replace('/');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="label" style={{ color: theme.accentStrong }}>
          {t('onboarding.step', { current: 1, total: 2 })}
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          {t('onboarding.levelQuestion')}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          {t('onboarding.levelSubtitle')}
        </ThemedText>

        <View style={styles.list}>
          {SKILL_LEVELS.map((s) => {
            const picked = skillLevel === s.value;
            return (
              <Pressable
                key={s.value}
                onPress={() => setSkillLevel(s.value)}
                style={[
                  styles.choiceCard,
                  { borderColor: theme.border, backgroundColor: theme.background },
                  picked && { borderColor: theme.accent, backgroundColor: theme.backgroundSelected },
                ]}>
                <ThemedText type="smallBold">{t(s.labelKey)}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t(s.descKey)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <ThemedText type="label" themeColor="textSecondary" style={styles.goalsLabel}>
          {t('onboarding.goalQuestion')}
        </ThemedText>
        <View style={styles.chipRow}>
          {GOALS.map((key) => {
            const picked = goals.includes(key);
            return (
              <Pressable
                key={key}
                onPress={() => toggleGoal(key)}
                style={[
                  styles.chip,
                  { borderColor: theme.border },
                  picked && { backgroundColor: theme.accent, borderColor: theme.accentStrong },
                ]}>
                <ThemedText type="smallBold" style={picked ? { color: theme.accentOn } : undefined}>
                  {t(key)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <PressButton label={t('onboarding.createPath')} onPress={handleCreate} style={styles.createButton} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: { marginTop: Spacing.one, marginBottom: Spacing.one },
  subtitle: { marginBottom: Spacing.four },
  list: { gap: Spacing.two, marginBottom: Spacing.four },
  choiceCard: {
    borderWidth: 2,
    borderRadius: Radii.md,
    padding: Spacing.three,
    gap: 2,
  },
  goalsLabel: { marginBottom: Spacing.two },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginBottom: Spacing.five },
  chip: {
    borderWidth: 1.5,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  createButton: { marginTop: 'auto' },
});
