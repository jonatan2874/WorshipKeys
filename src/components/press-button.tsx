import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Botón con relieve ("3D"): sombra sólida inferior, estilo Duolingo/Simply Piano. */
export function PressButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.accent,
          shadowColor: theme.accentStrong,
          transform: pressed ? [{ translateY: 3 }] : [{ translateY: 0 }],
          shadowOffset: { width: 0, height: pressed ? 1 : 5 },
        },
        style,
      ]}>
      <ThemedText type="subtitle" style={{ color: theme.accentOn, fontSize: 15 }}>
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
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
});
