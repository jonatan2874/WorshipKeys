import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { PianoKeyboard } from '@/components/illustrations/piano-keyboard';
import { IconClose } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { pitchClassOf } from '@/lib/evaluation/note-match';

export interface ReferenceItem {
  displayName: string;
  notes: string[];
}

/** Panel deslizable con todos los acordes/notas de la lección — imagen del
 * teclado + nombre + notas de cada uno, como recurso de consulta rápida
 * mientras se practica (no reemplaza la práctica, solo evita tener que
 * volver atrás a la teoría a revisar). */
export function ReferenceSheet({
  visible,
  onClose,
  title,
  items,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: ReferenceItem[];
}) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{title}</ThemedText>
          <Pressable onPress={onClose} hitSlop={12} style={[styles.closeButton, { backgroundColor: theme.backgroundElement }]}>
            <IconClose size={12} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <View key={item.displayName} style={[styles.item, { backgroundColor: theme.backgroundElement }]}>
              <PianoKeyboard highlightNotes={item.notes} height={56} />
              <ThemedText type="smallBold" style={styles.itemName}>
                {item.displayName}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.notes.map(pitchClassOf).join(', ')}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '75%',
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  item: {
    width: '47%',
    borderRadius: Radii.md,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
  itemName: { marginTop: Spacing.one },
});
