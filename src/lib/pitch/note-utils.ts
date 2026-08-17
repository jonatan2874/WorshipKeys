// Utilidades de conversión frecuencia <-> nota musical.
// A4 = 440Hz = MIDI 69, siguiendo afinación temperada estándar.

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const NOTE_NAMES_ES: Record<(typeof NOTE_NAMES)[number], string> = {
  C: 'Do',
  'C#': 'Do#',
  D: 'Re',
  'D#': 'Re#',
  E: 'Mi',
  F: 'Fa',
  'F#': 'Fa#',
  G: 'Sol',
  'G#': 'Sol#',
  A: 'La',
  'A#': 'La#',
  B: 'Si',
};

export interface DetectedNote {
  frequency: number;
  midi: number;
  pitchClass: (typeof NOTE_NAMES)[number];
  octave: number;
  noteName: string;
  displayNameEs: string;
  /** Desviación en cents respecto al centro de la nota más cercana (-50 a +50). */
  cents: number;
}

export function frequencyToMidi(frequency: number): number {
  return 69 + 12 * Math.log2(frequency / 440);
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function frequencyToNote(frequency: number): DetectedNote | null {
  if (!frequency || frequency <= 0 || !Number.isFinite(frequency)) return null;

  const midiExact = frequencyToMidi(frequency);
  const midiRounded = Math.round(midiExact);
  const cents = (midiExact - midiRounded) * 100;

  const pitchClassIndex = ((midiRounded % 12) + 12) % 12;
  const pitchClass = NOTE_NAMES[pitchClassIndex];
  const octave = Math.floor(midiRounded / 12) - 1;

  return {
    frequency,
    midi: midiRounded,
    pitchClass,
    octave,
    noteName: `${pitchClass}${octave}`,
    displayNameEs: `${NOTE_NAMES_ES[pitchClass]}${octave}`,
    cents,
  };
}
