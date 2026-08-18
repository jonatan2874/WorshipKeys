import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconBars, IconFlame } from '@/components/icons';
import { LevelAccordion } from '@/components/level-accordion';
import { PressButton } from '@/components/press-button';
import { StatChip } from '@/components/stat-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import { getLevelStatuses, getStageLabel } from '@/lib/curriculum/progress';
import { curriculumStages, sampleLevels } from '@/lib/curriculum/sample-data';
import { groupLevelsByStage } from '@/lib/curriculum/stages';

export default function InicioScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { progress } = useProgress();

  const statuses = getLevelStatuses(sampleLevels, progress.completedLevelIds);
  const stages = groupLevelsByStage(sampleLevels, curriculumStages, statuses);
  const currentLevel = sampleLevels.find((level) => statuses[level.id] === 'current');
  const currentStageNumber = stages.find((s) => s.status === 'current')?.number ?? stages[0]?.number ?? '0';

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
              value={t('inicio.levelOf', { current: currentStageNumber, total: stages.length })}
              label={t('inicio.progress')}
            />
          </View>

          <ThemedText type="title" style={styles.greeting}>
            {t('inicio.greeting')}
          </ThemedText>

          <View style={[styles.banner, { backgroundColor: theme.accent }]}>
            <ThemedText type="label" style={{ color: theme.accentOn }}>
              {currentLevel ? t(getStageLabel(currentLevel)) : t('inicio.unit')}
            </ThemedText>
          </View>

          <LevelAccordion
            stages={stages}
            statuses={statuses}
            onSelectLesson={(level) => router.push(`/leccion?levelId=${level.id}`)}
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
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
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
