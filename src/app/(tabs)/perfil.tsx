import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radii, Spacing } from '@/constants/theme';
import { Language, ThemePreference, useAppSettings } from '@/contexts/app-settings';
import { useAuth } from '@/contexts/auth-context';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import { sampleLevels } from '@/lib/curriculum/sample-data';

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.segmented, { backgroundColor: theme.backgroundElement }]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={active ? { color: theme.accentOn } : undefined}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function PerfilScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { language, setLanguage, themePreference, setThemePreference } = useAppSettings();
  const { progress } = useProgress();
  const { user, initializing, signInWithGoogle, signOut } = useAuth();
  const chordsLearned = progress.chordsLearned;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">{t('perfil.title')}</ThemedText>
        </View>

        <View style={styles.section}>
          {user ? (
            <View style={[styles.accountCard, { backgroundColor: theme.backgroundElement }]}>
              {user.photoURL && <Image source={{ uri: user.photoURL }} style={styles.avatar} />}
              <View style={styles.accountInfo}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {user.displayName ?? user.email}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {t('perfil.synced')}
                </ThemedText>
              </View>
              <Pressable onPress={signOut} hitSlop={8}>
                <ThemedText type="link" style={{ color: theme.doneStrong }}>
                  {t('perfil.signOut')}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            !initializing && (
              <>
                <PressButton label={t('perfil.signInGoogle')} onPress={signInWithGoogle} />
                <ThemedText type="small" themeColor="textSecondary" style={styles.syncWarning}>
                  {t('perfil.syncWarning')}
                </ThemedText>
              </>
            )
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="title" style={{ color: theme.accent }}>
              {progress.completedLevelIds.length}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('perfil.levelsCompleted')}
            </ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="title" style={{ color: theme.done }}>
              {progress.currentStreak}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('perfil.streakDaysLabel')}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('perfil.chordsLearned')}
          </ThemedText>
          <View style={styles.chordRow}>
            {chordsLearned.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                {t('perfil.noChordsYet')}
              </ThemedText>
            ) : (
              chordsLearned.map((chord) => (
                <View key={chord} style={[styles.chordChip, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="smallBold">{chord}</ThemedText>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('perfil.curriculum')}
          </ThemedText>
          {sampleLevels.map((level, index) => (
            <View key={level.id} style={styles.curriculumRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.curriculumIndex}>
                {index + 1}
              </ThemedText>
              <ThemedText type="small">{t(level.title)}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('perfil.language')}
          </ThemedText>
          <SegmentedControl<Language>
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'es', label: 'Español' },
              { value: 'en', label: 'English' },
            ]}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('perfil.theme')}
          </ThemedText>
          <SegmentedControl<ThemePreference>
            value={themePreference}
            onChange={setThemePreference}
            options={[
              { value: 'system', label: t('perfil.themeSystem') },
              { value: 'light', label: t('perfil.themeLight') },
              { value: 'dark', label: t('perfil.themeDark') },
            ]}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  header: { paddingTop: Spacing.two, paddingBottom: Spacing.three },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radii.md,
    padding: Spacing.three,
  },
  accountInfo: { flex: 1, gap: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  syncWarning: {
    marginTop: Spacing.two,
    lineHeight: 18,
  },
  statsRow: { flexDirection: 'row', gap: Spacing.three, marginBottom: Spacing.five },
  statCard: {
    flex: 1,
    borderRadius: Radii.md,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 2,
  },
  section: { marginBottom: Spacing.five },
  sectionTitle: { marginBottom: Spacing.two },
  chordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chordChip: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  curriculumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one + 2,
  },
  curriculumIndex: { width: 18 },
  segmented: {
    flexDirection: 'row',
    borderRadius: Radii.pill,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radii.pill,
  },
});
