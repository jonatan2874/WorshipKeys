import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconBars, IconFlame } from '@/components/icons';
import { LevelPath } from '@/components/level-path';
import { PressButton } from '@/components/press-button';
import { StatChip } from '@/components/stat-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radii, Spacing } from '@/constants/theme';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import { getLevelStatuses } from '@/lib/curriculum/progress';
import { sampleLevels } from '@/lib/curriculum/sample-data';

export default function InicioScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { progress } = useProgress();

  const statuses = getLevelStatuses(sampleLevels, progress.completedLevelIds);
  const levelNumbers = Object.fromEntries(sampleLevels.map((level, index) => [level.id, index + 1]));
  const currentLevel = sampleLevels.find((level) => statuses[level.id] === 'current');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.chips}>
            <StatChip
              icon={<IconFlame />}
              value={t('inicio.streakDays', { count: progress.currentStreak })}
              label={t('inicio.streak')}
            />
            <StatChip
              icon={<IconBars />}
              value={t('inicio.levelOf', {
                current: levelNumbers[currentLevel?.id ?? sampleLevels[0].id],
                total: sampleLevels.length,
              })}
              label={t('inicio.progress')}
            />
          </View>

          <ThemedText type="title" style={styles.greeting}>
            {t('inicio.greeting')}
          </ThemedText>

          <View style={[styles.banner, { backgroundColor: theme.accent }]}>
            <ThemedText type="label" style={{ color: theme.accentOn }}>
              {currentLevel ? t(currentLevel.title) : t('inicio.unit')}
            </ThemedText>
          </View>

          <LevelPath
            levels={sampleLevels}
            statuses={statuses}
            levelNumbers={levelNumbers}
            onSelectLevel={(level) => router.push(`/leccion?levelId=${level.id}`)}
          />

          <PressButton
            label={currentLevel ? t('leccion.continue') : t('inicio.continuePractice')}
            onPress={() => router.push(currentLevel ? `/leccion?levelId=${currentLevel.id}` : '/leccion')}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  greeting: {
    marginBottom: Spacing.three,
  },
  banner: {
    alignSelf: 'flex-start',
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.four,
  },
});
