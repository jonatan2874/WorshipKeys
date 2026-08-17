import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconCheck, IconLock } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LevelStatus } from '@/lib/curriculum/progress';
import { Level } from '@/lib/curriculum/types';

const POSITIONS: ('left' | 'mid' | 'right')[] = ['mid', 'right', 'mid', 'left'];

export function LevelPath({
  levels,
  statuses,
  levelNumbers,
  onSelectLevel,
}: {
  levels: Level[];
  statuses: Record<string, LevelStatus>;
  /** Número visible dentro del círculo "actual" (1-indexado). */
  levelNumbers: Record<string, number>;
  /** Se llama al tocar un nivel desbloqueado (actual o completado). */
  onSelectLevel?: (level: Level) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.path}>
      <View style={[styles.line, { borderLeftColor: theme.accent }]} />
      {levels.map((level, index) => {
        const status = statuses[level.id];
        const position = POSITIONS[index % POSITIONS.length];

        return (
          <View
            key={level.id}
            style={[
              styles.row,
              position === 'left' && styles.rowLeft,
              position === 'mid' && styles.rowMid,
              position === 'right' && styles.rowRight,
            ]}>
            <Pressable
              disabled={status === 'locked'}
              onPress={() => onSelectLevel?.(level)}
              hitSlop={8}
              style={styles.node}>
              <View
                style={[
                  styles.circle,
                  status === 'done' && { backgroundColor: theme.done, shadowColor: theme.doneStrong },
                  status === 'locked' && { backgroundColor: theme.backgroundElement, shadowColor: 'transparent' },
                  status === 'current' && {
                    backgroundColor: theme.background,
                    borderColor: theme.accent,
                    borderWidth: 3.5,
                    shadowColor: theme.accentStrong,
                  },
                  status === 'current' && [styles.currentRing, { borderColor: theme.currentRing }],
                ]}>
                {status === 'done' && <IconCheck size={20} color="#fff" />}
                {status === 'locked' && <IconLock size={16} color={theme.textSecondary} />}
                {status === 'current' && (
                  <ThemedText style={[styles.currentNumber, { color: theme.accent }]}>
                    {levelNumbers[level.id]}
                  </ThemedText>
                )}
              </View>

              {(status === 'current' || status === 'done') && (
                <View
                  style={[
                    styles.callout,
                    { backgroundColor: status === 'current' ? theme.accent : theme.done },
                    position === 'left' ? styles.calloutRight : styles.calloutLeft,
                  ]}>
                  <ThemedText
                    style={[styles.calloutText, { color: status === 'current' ? theme.accentOn : '#3D2400' }]}
                    numberOfLines={1}>
                    {t(level.title)}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const CIRCLE = 52;

const styles = StyleSheet.create({
  path: {
    position: 'relative',
    paddingVertical: Spacing.one,
  },
  line: {
    position: 'absolute',
    left: '50%',
    top: 8,
    bottom: 8,
    marginLeft: -1.5,
    width: 0,
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.four,
  },
  rowMid: { justifyContent: 'center' },
  rowLeft: { justifyContent: 'flex-start', paddingLeft: 8 },
  rowRight: { justifyContent: 'flex-end', paddingRight: 8 },
  node: {
    position: 'relative',
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  currentRing: {
    // segundo aro simulando el glow del mockup vía sombra extra
    shadowOpacity: 0.001,
  },
  currentNumber: {
    fontFamily: Fonts.display,
    fontSize: 18,
  },
  callout: {
    position: 'absolute',
    top: -6,
    paddingHorizontal: Spacing.two,
    paddingVertical: 7,
    borderRadius: 10,
    maxWidth: 150,
  },
  calloutLeft: { left: '50%', marginLeft: 40 },
  calloutRight: { right: '50%', marginRight: 40 },
  calloutText: {
    fontFamily: Fonts.display,
    fontSize: 11,
  },
});
