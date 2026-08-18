import { mdiHandFrontLeft, mdiHandFrontRight } from '@mdi/js';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

// Ícono de mano de un set ya diseñado (Material Design Icons), como datos
// vectoriales crudos (no una fuente tipográfica) — así el trazo es siempre
// idéntico sin importar navegador/plataforma, y las medallas numeradas
// caen exactamente donde se calibraron, siempre.
const ICON_VIEWBOX = 24;

type Badge = { number: number; x: number; y: number };

// Posiciones calibradas sobre la cuadrícula nativa del ícono (0–24).
const BADGES_RIGHT: Badge[] = [
  { number: 1, x: 19.75, y: 8 },
  { number: 2, x: 16.25, y: 2 },
  { number: 3, x: 12.75, y: 0 },
  { number: 4, x: 9.25, y: 1.5 },
  { number: 5, x: 5.75, y: 4.5 },
];
const BADGES_LEFT: Badge[] = [
  { number: 1, x: 4.25, y: 8 },
  { number: 2, x: 7.75, y: 2 },
  { number: 3, x: 11.25, y: 0 },
  { number: 4, x: 14.75, y: 1.5 },
  { number: 5, x: 18.25, y: 4.5 },
];

export function HandDiagram({
  side = 'right',
  highlightFinger,
  height = 110,
}: {
  side?: 'left' | 'right';
  highlightFinger?: number;
  height?: number;
}) {
  const theme = useTheme();
  const badges = side === 'left' ? BADGES_LEFT : BADGES_RIGHT;
  const size = height * 0.9;
  // Radio de medalla en unidades del viewBox del ícono (0–24), para que
  // escale junto con el ícono sin importar el tamaño final en pantalla.
  // Los 4 dedos (sin el pulgar) quedan a solo ~3.5 unidades entre sí, así
  // que el radio tiene que ser bien chico para que las medallas no se
  // encimen entre ellas.
  const badgeR = 1.5;
  const fontSize = 1.7;

  // La medalla del dedo más alto (3, y=0) queda justo en el borde superior
  // del ícono — sin margen extra el círculo se recorta ahí. Se agranda el
  // viewBox hacia arriba (sin mover el ícono) para que quepa completa.
  const topPad = 2;

  return (
    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={(size * (ICON_VIEWBOX + topPad)) / ICON_VIEWBOX} viewBox={`0 ${-topPad} ${ICON_VIEWBOX} ${ICON_VIEWBOX + topPad}`}>
        <Path d={side === 'left' ? mdiHandFrontLeft : mdiHandFrontRight} fill={theme.text} />
        {badges.map((b) => {
          const isActive = b.number === highlightFinger;
          return (
            <G key={b.number}>
              <Circle
                cx={b.x}
                cy={b.y}
                r={badgeR}
                fill={isActive ? theme.accent : theme.background}
                stroke={theme.text}
                strokeWidth={0.5}
              />
              <SvgText
                x={b.x}
                y={b.y + fontSize * 0.35}
                fontSize={fontSize}
                fontWeight="800"
                textAnchor="middle"
                fill={isActive ? theme.accentOn : theme.text}>
                {b.number}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
