/**
 * WorshipKeys — dirección visual "Verde salmo" (aprobada).
 * Teal fresco como acento de marca, ámbar reservado para estados "completado".
 */

import '@/global.css';

export const Colors = {
  light: {
    text: '#16241C',
    textSecondary: '#6B7C73',
    background: '#F6FBF8',
    backgroundElement: '#E3F3EC',
    backgroundSelected: '#D3EBE0',
    accent: '#17A398',
    accentStrong: '#0E7A70',
    accentOn: '#FFFFFF',
    done: '#F2A93B',
    doneStrong: '#C97D00',
    currentRing: 'rgba(23, 163, 152, 0.16)',
    border: '#DCEFE6',
  },
  dark: {
    text: '#EAF3EE',
    textSecondary: '#8FA79C',
    background: '#0F1713',
    backgroundElement: '#1A2620',
    backgroundSelected: '#22332B',
    accent: '#22C7B8',
    accentStrong: '#159485',
    accentOn: '#062420',
    done: '#F2A93B',
    doneStrong: '#C97D00',
    currentRing: 'rgba(34, 199, 184, 0.22)',
    border: '#22332B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Cargadas vía useFonts (expo-font) en el layout raíz — ver src/hooks/use-app-fonts.ts.
export const Fonts = {
  display: 'Fredoka_700Bold',
  displaySemiBold: 'Fredoka_600SemiBold',
  displayMedium: 'Fredoka_500Medium',
  body: 'Nunito_400Regular',
  bodyMedium: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_800ExtraBold',
  mono: 'ui-monospace',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;
