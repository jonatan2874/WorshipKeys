import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Botón plano minimal: relleno sólido, sin sombra ni efecto 3D — solo se
 * oscurece un poco al presionar. `variant="secondary"` es una versión con
 * contorno para acciones de menor jerarquía (p. ej. "Volver") que conviven
 * junto a la acción principal. */
export function PressButton({
  label,
  onPress,
  style,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
}) {
  const theme = useTheme();
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary
          ? {
              backgroundColor: theme.background,
              borderWidth: 1.5,
              borderColor: theme.border,
              opacity: pressed ? 0.7 : 1,
            }
          : {
              backgroundColor: pressed ? theme.accentStrong : theme.accent,
            },
        style,
      ]}>
      <ThemedText type="subtitle" style={{ color: isSecondary ? theme.text : theme.accentOn, fontSize: 15 }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
  },
});
