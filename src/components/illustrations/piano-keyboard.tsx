import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

const WHITE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
// true = hay tecla negra inmediatamente después de esta blanca (no hay entre E-F ni B-C).
const HAS_BLACK_AFTER: Record<string, boolean> = {
  C: true,
  D: true,
  E: false,
  F: true,
  G: true,
  A: true,
  B: false,
};

function buildWhiteNotes(fromOctave: number, toOctave: number): string[] {
  const notes: string[] = [];
  for (let octave = fromOctave; octave < toOctave; octave++) {
    for (const letter of WHITE_LETTERS) notes.push(`${letter}${octave}`);
  }
  notes.push(`C${toOctave}`);
  return notes;
}

const WHITE_NOTES = buildWhiteNotes(3, 5);
const WHITE_W = 24;
const WHITE_H = 92;
const BLACK_W = 14;
const BLACK_H = 56;
const LABEL_SPACE = 20;
const VIEW_W = WHITE_NOTES.length * WHITE_W;

export function PianoKeyboard({
  highlightNotes = [],
  markMiddleC = false,
  height = 96,
}: {
  /** Notas exactas con octava, ej. ['C4', 'E4', 'G4']. */
  highlightNotes?: string[];
  markMiddleC?: boolean;
  height?: number;
}) {
  const theme = useTheme();
  const highlightSet = new Set(highlightNotes);
  const viewH = WHITE_H + (markMiddleC ? LABEL_SPACE : 0);
  const middleCIndex = WHITE_NOTES.indexOf('C4');

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${VIEW_W} ${viewH}`}>
      {WHITE_NOTES.map((note, i) => (
        <Rect
          key={note}
          x={i * WHITE_W}
          y={0}
          width={WHITE_W - 1.5}
          height={WHITE_H}
          rx={4}
          fill={highlightSet.has(note) ? theme.accent : '#FFFFFF'}
          stroke={theme.border}
          strokeWidth={1}
        />
      ))}
      {WHITE_NOTES.map((note, i) => {
        const letter = note[0];
        if (!HAS_BLACK_AFTER[letter] || i === WHITE_NOTES.length - 1) return null;
        const blackNote = `${letter}#${note.slice(1)}`;
        return (
          <Rect
            key={blackNote}
            x={(i + 1) * WHITE_W - BLACK_W / 2}
            y={0}
            width={BLACK_W}
            height={BLACK_H}
            rx={3}
            fill={highlightSet.has(blackNote) ? theme.accent : '#211D18'}
          />
        );
      })}
      {markMiddleC && middleCIndex >= 0 && (
        <SvgText
          x={middleCIndex * WHITE_W + WHITE_W / 2}
          y={WHITE_H + 15}
          fontSize={11}
          fontWeight="700"
          fill={theme.accent}
          textAnchor="middle">
          Do central
        </SvgText>
      )}
    </Svg>
  );
}
