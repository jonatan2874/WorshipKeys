import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconCheck, IconLock } from '@/components/icons';
import { PressButton } from '@/components/press-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Radii, Spacing } from '@/constants/theme';
import { Language, ThemePreference, useAppSettings } from '@/contexts/app-settings';
import { useAuth } from '@/contexts/auth-context';
import { useProgress } from '@/contexts/progress-context';
import { useTheme } from '@/hooks/use-theme';
import { getEarnedBadges } from '@/lib/curriculum/badges';
import { getLevelStatuses } from '@/lib/curriculum/progress';
import { curriculumStages, sampleLevels } from '@/lib/curriculum/sample-data';
import { groupLevelsByStage } from '@/lib/curriculum/stages';

const WEEKDAY_LETTERS_KEY = [
  'perfil.weekdayMon',
  'perfil.weekdayTue',
  'perfil.weekdayWed',
  'perfil.weekdayThu',
  'perfil.weekdayFri',
  'perfil.weekdaySat',
  'perfil.weekdaySun',
];

/** Últimos 7 días (lunes a domingo de la semana actual), con si hubo
 * práctica real ese día — nada simulado, viene de `practiceDates`. */
function useWeekDays(practiceDates: string[]) {
  return useMemo(() => {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7; // 0 = lunes
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);
    const set = new Set(practiceDates);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toLocaleDateString('sv-SE');
      return { iso, practiced: set.has(iso) };
    });
  }, [practiceDates]);
}

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

  const statuses = getLevelStatuses(sampleLevels, progress.completedLevelIds);
  const stages = groupLevelsByStage(sampleLevels, curriculumStages, statuses);
  const badges = getEarnedBadges(progress, stages);
  const weekDays = useWeekDays(progress.practiceDates);
  const initial = (user?.displayName ?? user?.email ?? 'W').charAt(0).toUpperCase();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">{t('perfil.title')}</ThemedText>
        </View>

        <View style={styles.section}>
          {user ? (
            <View style={[styles.accountCard, { backgroundColor: theme.backgroundElement }]}>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: theme.accent }]}>
                  <ThemedText style={{ color: theme.accentOn, fontFamily: Fonts.display, fontSize: 16 }}>{initial}</ThemedText>
                </View>
              )}
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
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="title" style={{ color: theme.accentStrong }}>
              {Object.keys(progress.stepProgress).length}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('perfil.lessonsPracticed')}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.weekCard, { backgroundColor: theme.accent }]}>
          <ThemedText type="label" style={{ color: theme.accentOn, opacity: 0.85 }}>
            {t('perfil.week')}
          </ThemedText>
          <View style={styles.weekGrid}>
            {weekDays.map((day) => (
              <View
                key={day.iso}
                style={[styles.weekCell, { backgroundColor: 'rgba(255,255,255,0.18)' }, day.practiced && { backgroundColor: theme.done }]}
              />
            ))}
          </View>
          <View style={styles.weekLabels}>
            {WEEKDAY_LETTERS_KEY.map((key) => (
              <ThemedText key={key} type="label" style={{ color: theme.accentOn, opacity: 0.7, flex: 1, textAlign: 'center' }}>
                {t(key)}
              </ThemedText>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('perfil.badgesTitle')}
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    badge.earned && { backgroundColor: theme.done, borderColor: 'transparent' },
                  ]}>
                  {badge.earned ? <IconCheck size={18} color={theme.accentOn} /> : <IconLock size={16} color={theme.textSecondary} />}
                </View>
                <ThemedText type="label" style={styles.badgeLabel} numberOfLines={2}>
                  {t(badge.labelKey)}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
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
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
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
  weekCard: {
    borderRadius: Radii.md,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  weekGrid: { flexDirection: 'row', gap: Spacing.one },
  weekCell: { flex: 1, aspectRatio: 1, borderRadius: 5 },
  weekLabels: { flexDirection: 'row' },
  section: { marginBottom: Spacing.five },
  badgeRow: { flexDirection: 'row', gap: Spacing.three, paddingRight: Spacing.four },
  badgeItem: { width: 72, alignItems: 'center', gap: Spacing.one },
  badgeIcon: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: { textAlign: 'center', textTransform: 'none', letterSpacing: 0 },
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
