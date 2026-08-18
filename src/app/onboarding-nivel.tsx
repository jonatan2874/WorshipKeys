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
import { useTheme } from '@/hooks/use-theme';

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
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('nunca');
  const [goals, setGoals] = useState<string[]>([GOALS[0]]);

  function toggleGoal(key: string) {
    setGoals((prev) => (prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]));
  }

  function handleCreate() {
    completeOnboarding(skillLevel, goals);
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
