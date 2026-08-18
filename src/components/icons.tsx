import Svg, { Path, Rect } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

export function IconHome({ size = 20, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4.5v-6h-5v6H5a1 1 0 01-1-1v-8.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconSongs({ size = 20, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5l11-2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M6.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM17.5 19a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}

export function IconProfile({ size = 20, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconCheck({ size = 20, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconLock({ size = 16, color = '#000' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={9} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconFlame({ size = 14, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c1 3-3 4-3 7a3 3 0 006 0c0-1-1-2-1-2 2 1 3 3 3 5a5 5 0 01-10 0c0-4 3-6 5-10z"
        fill={color}
      />
    </Svg>
  );
}

export function IconMicOff({ size = 18, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 9.5V6a3 3 0 00-5.83-1M9 9v2.5a3 3 0 004.24 2.73M5 10.5c0 .3.02.6.06.9M12 18v3M8.5 21h7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M19 10.5a7 7 0 01-1.16 3.87M3 3l18 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconClose({ size = 14, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 5l14 14M19 5L5 19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconBars({ size = 14, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={5} width={4} height={14} rx={1} fill={color} />
      <Rect x={10} y={5} width={4} height={9} rx={1} fill={color} />
      <Rect x={16} y={5} width={4} height={12} rx={1} fill={color} />
    </Svg>
  );
}
