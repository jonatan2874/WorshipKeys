import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.icon, { backgroundColor: theme.accent }]}>{icon}</View>
      <View>
        <ThemedText style={styles.value}>{value}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radii.pill,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    paddingRight: Spacing.three,
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: Fonts.display,
    fontSize: 14,
  },
  label: {
    fontSize: 9.5,
    lineHeight: 12,
  },
});
