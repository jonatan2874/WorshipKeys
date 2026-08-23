import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { pitchClassOf } from '@/lib/evaluation/note-match';

const WHITE_NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
// true = hay tecla negra inmediatamente después de esta blanca (no hay entre E-F ni B-C).
const HAS_BLACK_AFTER: Record<string, boolean> = {
  C: true,
  D: true,
  E: false,
  F: true,
  G: true,
  A: true,
  B: false,
};

function buildWhiteKeys(fromOctave: number, toOctave: number): string[] {
  const keys: string[] = [];
  for (let octave = fromOctave; octave <= toOctave; octave++) {
    for (const letter of WHITE_NOTE_LETTERS) {
      keys.push(`${letter}${octave}`);
    }
  }
  return keys;
}

const WHITE_KEYS = buildWhiteKeys(3, 5);
const WHITE_W = 46;
const WHITE_H = 64;
const BLACK_W = 28;
const BLACK_H = 40;
const GAP = Spacing.one;
const STEP = WHITE_W + GAP;

export function TouchKeyboard({
  selectedNotes,
  onKeyPress,
}: {
  selectedNotes: string[];
  onKeyPress: (note: string) => void;
}) {
  const theme = useTheme();
  const selectedClasses = new Set(selectedNotes.map(pitchClassOf));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.board, { width: WHITE_KEYS.length * STEP - GAP, height: WHITE_H }]}>
        {WHITE_KEYS.map((note, i) => {
          const isSelected = selectedClasses.has(pitchClassOf(note));
          return (
            <Pressable
              key={note}
              onPress={() => onKeyPress(note)}
              style={[
                styles.whiteKey,
                { left: i * STEP, backgroundColor: theme.backgroundElement, borderColor: theme.border },
                isSelected && { backgroundColor: theme.accent, borderColor: theme.accentStrong },
              ]}>
              <ThemedText type="smallBold" style={isSelected ? { color: theme.accentOn } : undefined}>
                {note}
              </ThemedText>
            </Pressable>
          );
        })}
        {WHITE_KEYS.map((note, i) => {
          const letter = note[0];
          if (!HAS_BLACK_AFTER[letter] || i === WHITE_KEYS.length - 1) return null;
          const blackNote = `${letter}#${note.slice(1)}`;
          const isSelected = selectedClasses.has(pitchClassOf(blackNote));
          return (
            <Pressable
              key={blackNote}
              onPress={() => onKeyPress(blackNote)}
              style={[
                styles.blackKey,
                { left: (i + 1) * STEP - GAP / 2 - BLACK_W / 2 },
                isSelected ? { backgroundColor: theme.accent } : { backgroundColor: '#211D18' },
              ]}>
              <ThemedText type="label" style={{ color: '#fff' }}>
                {letter}#
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: Spacing.two,
  },
  board: {
    position: 'relative',
  },
  whiteKey: {
    position: 'absolute',
    top: 0,
    width: WHITE_W,
    height: WHITE_H,
    borderRadius: Radii.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.one,
  },
  blackKey: {
    position: 'absolute',
    top: 0,
    width: BLACK_W,
    height: BLACK_H,
    borderRadius: Radii.sm - 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    zIndex: 2,
  },
});
