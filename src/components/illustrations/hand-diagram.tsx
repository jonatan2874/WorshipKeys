import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

const W = 220;
const H = 130;
const PALM_X = 48;
const PALM_W = 124;
const PALM_Y = 88;

// Dedos numerados según convención de piano: 1 = pulgar … 5 = meñique.
// Cada dedo termina justo antes de PALM_Y (deja un hueco real con la palma,
// no solo un borde) para que se lean como formas separadas, igual que las
// teclas del piano se separan con un hueco real entre ellas.
const RIGHT_FINGERS = [
  { number: 1, x: 20, y: 60, w: 26, h: 26 },
  { number: 2, x: 68, y: 40, w: 18, h: 42 },
  { number: 3, x: 96, y: 22, w: 18, h: 60 },
  { number: 4, x: 124, y: 30, w: 18, h: 52 },
  { number: 5, x: 152, y: 46, w: 16, h: 36 },
];

function mirrorX(x: number, w: number) {
  return W - x - w;
}

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
  const mirror = side === 'left';
  const fingers = mirror ? RIGHT_FINGERS.map((f) => ({ ...f, x: mirrorX(f.x, f.w) })) : RIGHT_FINGERS;
  const palmX = mirror ? mirrorX(PALM_X, PALM_W) : PALM_X;
  const outline = theme.textSecondary;

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${W} ${H}`}>
      <Rect x={palmX} y={PALM_Y} width={PALM_W} height={40} rx={20} fill={theme.backgroundElement} stroke={outline} strokeWidth={1.5} />
      {fingers.map((f) => (
        <Rect
          key={`finger-${f.number}`}
          x={f.x}
          y={f.y}
          width={f.w}
          height={f.h}
          rx={f.w / 2}
          fill={f.number === highlightFinger ? theme.accent : '#FFFFFF'}
          stroke={outline}
          strokeWidth={2}
        />
      ))}
      {fingers.map((f) => (
        <Circle
          key={`badge-${f.number}`}
          cx={f.x + f.w / 2}
          cy={f.y + 17}
          r={10}
          fill={f.number === highlightFinger ? theme.accent : theme.background}
          stroke={outline}
          strokeWidth={1.5}
        />
      ))}
      {fingers.map((f) => (
        <SvgText
          key={`label-${f.number}`}
          x={f.x + f.w / 2}
          y={f.y + 21}
          fontSize={11}
          fontWeight="700"
          textAnchor="middle"
          fill={f.number === highlightFinger ? theme.accentOn : theme.text}>
          {f.number}
        </SvgText>
      ))}
    </Svg>
  );
}
