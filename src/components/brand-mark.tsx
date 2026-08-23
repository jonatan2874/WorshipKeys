import Svg, { Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Monograma "W entrelazada": los trazos rectos evocan el borde de las
 * teclas del piano, el trazo curvo evoca una cuerda — combina piano +
 * guitarra en la misma marca sin depender de ningún instrumento literal,
 * así la identidad no envejece si mañana se suman más instrumentos. */
export function BrandMark({
  size = 34,
  strokeColor,
  curveColor,
}: {
  size?: number;
  strokeColor?: string;
  curveColor?: string;
}) {
  const theme = useTheme();
  const stroke = strokeColor ?? theme.accent;
  const curve = curveColor ?? theme.done;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M8 16 L18 48 L28 28" stroke={stroke} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M28 28 C34 44 42 44 48 28" stroke={curve} strokeWidth={7} strokeLinecap="round" />
      <Path d="M48 28 L56 16" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
    </Svg>
  );
}

/** Ícono dentro de una placa redondeada — vista previa del ícono de app
 * (home screen) y punto focal para pantallas de bienvenida. */
export function BrandTile({ size = 56 }: { size?: number }) {
  const theme = useTheme();

  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: theme.accent }]}>
      <BrandMark size={size * 0.56} strokeColor="#fff" curveColor={theme.done} />
    </View>
  );
}

/** Ícono + nombre en una fila — lockup para cabeceras y pantallas de marca. */
export function BrandLockup({ size = 30, textSize = 19 }: { size?: number; textSize?: number }) {
  const theme = useTheme();

  return (
    <View style={styles.lockup}>
      <BrandMark size={size} />
      <ThemedText style={[styles.wordmark, { fontSize: textSize, color: theme.text }]}>WorshipKeys</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wordmark: { fontFamily: Fonts.display },
});
