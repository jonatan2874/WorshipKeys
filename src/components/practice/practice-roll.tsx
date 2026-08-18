import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Step } from '@/lib/curriculum/types';

/** Carril de "próximas notas/acordes" — no hay concepto de tempo/BPM en los
 * datos de un nivel, así que esto es una ventana fija de lo que sigue
 * (actual + próximas), no un juego rítmico con scroll animado a un tempo
 * real. El estado del tile "ahora" viene de `feedback` (resultado real de
 * `evaluateAttempt`), nunca simulado. */
export function PracticeRoll({
  steps,
  currentIndex,
  feedback,
  windowSize = 5,
}: {
  steps: Step[];
  currentIndex: number;
  feedback: 'correct' | 'incorrect' | null;
  windowSize?: number;
}) {
  const theme = useTheme();
  const window = steps.slice(currentIndex, currentIndex + windowSize);

  if (window.length === 0) return null;

  return (
    <View style={styles.track}>
      {window.map((s, i) => {
        const isNow = i === 0;
        const nowColor = feedback === 'correct' ? theme.accent : feedback === 'incorrect' ? theme.doneStrong : theme.done;
        return (
          <Animated.View
            key={`${currentIndex}-${i}`}
            entering={FadeIn.duration(200)}
            style={[
              styles.tile,
              isNow && styles.tileNow,
              {
                backgroundColor: isNow ? nowColor : theme.backgroundElement,
                borderColor: isNow ? 'transparent' : theme.border,
                borderWidth: isNow ? 0 : 1.5,
              },
            ]}>
            <ThemedText type={isNow ? 'subtitle' : 'smallBold'} style={{ color: isNow ? theme.accentOn : theme.textSecondary }}>
              {s.displayName}
            </ThemedText>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  tile: {
    minWidth: 42,
    height: 38,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  tileNow: { minWidth: 60, height: 50 },
});
