/**
 * WorshipKeys — dirección visual "Salterio" (mockup de referencia).
 * Verde "vespers" fresco como acento de marca, dorado reservado para
 * estados "completado", pergamino como base neutra en vez de mint.
 */

import '@/global.css';

export const Colors = {
  light: {
    text: '#3A3B52',
    textSecondary: '#8B8EA6',
    background: '#FAF9F4',
    backgroundElement: '#F0EEE3',
    backgroundSelected: '#E9E6D9',
    accent: '#43B77B',
    accentStrong: '#2FA06A',
    accentOn: '#FFFFFF',
    done: '#F0A94E',
    doneStrong: '#DB9235',
    currentRing: 'rgba(67, 183, 123, 0.16)',
    border: '#EDEAE0',
    // Fondo de avisos tipo snackbar (p. ej. "no te escuchamos bien") —
    // deliberadamente neutro/oscuro en ambos temas, distinto del resto de
    // la paleta, para que se lea como un aviso del sistema y no como
    // contenido de la lección.
    micToastBg: 'rgba(58, 59, 82, 0.94)',
  },
  dark: {
    text: '#F3F1E8',
    textSecondary: '#A6A8BE',
    background: '#1C1D2B',
    backgroundElement: '#262739',
    backgroundSelected: '#2E3044',
    accent: '#4FCB8D',
    accentStrong: '#38A873',
    accentOn: '#0B2118',
    done: '#F0A94E',
    doneStrong: '#DB9235',
    currentRing: 'rgba(79, 203, 141, 0.22)',
    border: '#2E3044',
    micToastBg: 'rgba(10, 11, 18, 0.94)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Cargadas vía useFonts (expo-font) en el layout raíz — ver src/app/_layout.tsx.
export const Fonts = {
  display: 'Baloo2_700Bold',
  displaySemiBold: 'Baloo2_600SemiBold',
  displayMedium: 'Baloo2_500Medium',
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
