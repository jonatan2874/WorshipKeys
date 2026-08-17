import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { pitchClassOf } from '@/lib/evaluation/note-match';

const WHITE_NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function buildKeys(fromOctave: number, toOctave: number): string[] {
  const keys: string[] = [];
  for (let octave = fromOctave; octave <= toOctave; octave++) {
    for (const letter of WHITE_NOTE_LETTERS) {
      keys.push(`${letter}${octave}`);
    }
  }
  return keys;
}

const KEYS = buildKeys(3, 5);

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {KEYS.map((note) => {
        const isSelected = selectedClasses.has(pitchClassOf(note));
        return (
          <Pressable
            key={note}
            onPress={() => onKeyPress(note)}
            style={[
              styles.key,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              isSelected && { backgroundColor: theme.accent, borderColor: theme.accentStrong },
            ]}>
            <ThemedText
              type="smallBold"
              style={isSelected ? { color: theme.accentOn } : undefined}>
              {note}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  key: {
    width: 46,
    height: 64,
    borderRadius: Radii.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.one,
  },
});
