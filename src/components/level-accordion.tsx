import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconCheck, IconLock } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { getLessonKind } from '@/lib/curriculum/lesson-kind';
import { isPremiumLevel } from '@/lib/curriculum/paywall';
import { LevelStatus } from '@/lib/curriculum/progress';
import { StageGroup } from '@/lib/curriculum/stages';
import { Level } from '@/lib/curriculum/types';

const KIND_LABEL_KEY: Record<ReturnType<typeof getLessonKind>, string> = {
  teoria: 'inicio.kindTeoria',
  practica: 'inicio.kindPractica',
  proximamente: 'inicio.kindProximamente',
};

export function LevelAccordion({
  stages,
  statuses,
  onSelectLesson,
}: {
  stages: StageGroup[];
  statuses: Record<string, LevelStatus>;
  onSelectLesson?: (level: Level) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [openKey, setOpenKey] = useState<string | null>(stages.find((s) => s.status === 'current')?.key ?? null);

  return (
    <View style={styles.list}>
      {stages.map((stage) => {
        const isOpen = openKey === stage.key;
        const doneCount = stage.levels.filter((l) => statuses[l.id] === 'done').length;

        return (
          <View key={stage.key} style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Pressable
              onPress={() => setOpenKey(isOpen ? null : stage.key)}
              style={styles.header}
              hitSlop={4}>
              <View
                style={[
                  styles.numCircle,
                  { backgroundColor: theme.backgroundElement },
                  stage.status === 'done' && { backgroundColor: theme.accent },
                  stage.status === 'current' && { backgroundColor: theme.done },
                ]}>
                {stage.status === 'done' ? (
                  <IconCheck size={16} color={theme.accentOn} />
                ) : stage.status === 'locked' ? (
                  <IconLock size={14} color={theme.textSecondary} />
                ) : (
                  <ThemedText type="smallBold" style={{ color: theme.accentOn }}>
                    {stage.number}
                  </ThemedText>
                )}
              </View>
              <View style={styles.headerTitles}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {t('inicio.stageLabel', { number: stage.number, title: t(stage.key) })}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('inicio.lessonCount', { done: doneCount, total: stage.levels.length })}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={isOpen && styles.chevronOpen}>
                ⌄
              </ThemedText>
            </Pressable>

            {isOpen && (
              <View style={[styles.lessons, { borderTopColor: theme.border }]}>
                {stage.levels.map((level, i) => {
                  const status = statuses[level.id];
                  const kind = getLessonKind(level);
                  return (
                    <Pressable
                      key={level.id}
                      disabled={status === 'locked'}
                      onPress={() => onSelectLesson?.(level)}
                      style={[styles.lessonRow, i > 0 && { borderTopColor: theme.border, borderTopWidth: 1 }]}>
                      <View
                        style={[
                          styles.lessonIcon,
                          { backgroundColor: theme.backgroundElement },
                          status === 'done' && { backgroundColor: theme.accent },
                          status === 'current' && { backgroundColor: theme.done },
                        ]}>
                        {status === 'done' ? (
                          <IconCheck size={13} color={theme.accentOn} />
                        ) : status === 'locked' ? (
                          <IconLock size={11} color={theme.textSecondary} />
                        ) : (
                          <View style={[styles.dot, { backgroundColor: theme.accentOn }]} />
                        )}
                      </View>
                      <View style={styles.lessonTitles}>
                        <ThemedText type="small" numberOfLines={1} style={styles.lessonTitleText}>
                          {t(level.title)}
                        </ThemedText>
                        <ThemedText type="label" themeColor="textSecondary">
                          {t(KIND_LABEL_KEY[kind])}
                        </ThemedText>
                      </View>
                      {isPremiumLevel(level) && !user && (
                        <View style={[styles.premiumBadge, { backgroundColor: theme.done }]}>
                          <ThemedText type="label" style={{ color: '#fff' }}>
                            {t('inicio.premiumBadge')}
                          </ThemedText>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  card: {
    borderRadius: Radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  numCircle: {
    width: 34,
    height: 34,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitles: { flex: 1, gap: 2, minWidth: 0 },
  chevronOpen: { transform: [{ scaleY: -1 }] },
  lessons: { borderTopWidth: 1 },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  lessonIcon: {
    width: 26,
    height: 26,
    borderRadius: Radii.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  premiumBadge: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    flexShrink: 0,
  },
  lessonTitles: { flex: 1, gap: 1, minWidth: 0 },
  lessonTitleText: { fontWeight: '700' },
});
