import { pitchClassOf } from '../evaluation/note-match';
import { ChordPoolItem, Level, NotePoolItem, PracticePool, Step } from './types';

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** `count` elementos en orden al azar, reponiendo el mazo barajado cada vez
 * que se agota — así nunca se repite un elemento antes de que salgan todos
 * los demás, pero la secuencia completa igual cambia en cada llamada. */
function pickRandomSequence<T>(pool: T[], count: number): T[] {
  const result: T[] = [];
  let bag: T[] = [];
  while (result.length < count) {
    if (bag.length === 0) bag = shuffle(pool);
    result.push(bag.shift() as T);
  }
  return result;
}

function noteToStep(item: NotePoolItem): Step {
  const label = item.hand === 'left' ? 'Identifica con la izquierda' : 'Identifica';
  return {
    kind: 'note',
    expectedNotes: [item.note],
    instructionText: `${label}: ${item.displayName}`,
    displayName: item.displayName,
    fingerNumber: item.fingerNumber,
    hand: item.hand,
  };
}

function chordToStep(item: ChordPoolItem): Step {
  const noteNames = item.notes.map(pitchClassOf).join(', ');
  return {
    kind: 'chord',
    expectedNotes: item.notes,
    instructionText: `Toca todas las notas: ${noteNames}`,
    displayName: item.displayName,
  };
}

/** Arma los pasos de práctica/repaso de un nivel a partir de su pool — una
 * secuencia distinta en cada llamada (nueva lección o "repetir nivel"). */
export function generatePracticeSteps(pool: PracticePool): Step[] {
  const steps: Step[] = [];

  if (pool.notes && pool.notes.length > 0) {
    const count = pool.noteQuizCount ?? pool.notes.length;
    steps.push(...pickRandomSequence(pool.notes, count).map(noteToStep));
  }

  if (pool.chords && pool.chords.length > 0) {
    steps.push(...shuffle(pool.chords).map(chordToStep));
  }

  return steps;
}

/** Pasos efectivos de un nivel para un intento: el prefijo fijo (enseñanza,
 * info) seguido de los pasos de práctica generados al azar, si aplica. */
export function buildLevelSteps(level: Level): Step[] {
  if (!level.practicePool) return level.steps;
  return [...level.steps, ...generatePracticeSteps(level.practicePool)];
}
