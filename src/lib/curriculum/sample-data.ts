import { StageDef } from './stages';
import { Level, NotePoolItem, Song, UserProgress } from './types';

/** Las 12 etapas del currículo (0–9 y "opcional"), en el orden en que se
 * muestran en el camino de niveles. */
export const curriculumStages: StageDef[] = [
  { key: 'curriculum.stage0.title', number: '0' },
  { key: 'curriculum.stage1.title', number: '1' },
  { key: 'curriculum.stage2.title', number: '2' },
  { key: 'curriculum.stage3.title', number: '3' },
  { key: 'curriculum.stage4.title', number: '4' },
  { key: 'curriculum.stage5.title', number: '5' },
  { key: 'curriculum.stage6.title', number: '6' },
  { key: 'curriculum.stage7.title', number: '7' },
  { key: 'curriculum.stage8.title', number: '8' },
  { key: 'curriculum.stage9.title', number: '9' },
  { key: 'curriculum.stage10.title', number: '10' },
  { key: 'curriculum.stage99.title', number: '99' },
];

/** Las 7 notas de la posición básica de la mano derecha — pool para el
 * repaso al azar de "Práctica notas: Mano derecha". */
const rightHandNotePool: NotePoolItem[] = [
  { note: 'C4', displayName: 'C', fingerNumber: 1, hand: 'right' },
  { note: 'D4', displayName: 'D', fingerNumber: 2, hand: 'right' },
  { note: 'E4', displayName: 'E', fingerNumber: 3, hand: 'right' },
  { note: 'F4', displayName: 'F', fingerNumber: 4, hand: 'right' },
  { note: 'G4', displayName: 'G', fingerNumber: 5, hand: 'right' },
  { note: 'A4', displayName: 'A', hand: 'right' },
  { note: 'B4', displayName: 'B', hand: 'right' },
];

/** Las 7 notas de la posición básica de la mano izquierda — pool para el
 * repaso al azar de "Práctica notas: Mano izquierda". */
const leftHandNotePool: NotePoolItem[] = [
  { note: 'C3', displayName: 'C', fingerNumber: 5, hand: 'left' },
  { note: 'D3', displayName: 'D', fingerNumber: 4, hand: 'left' },
  { note: 'E3', displayName: 'E', fingerNumber: 3, hand: 'left' },
  { note: 'F3', displayName: 'F', fingerNumber: 2, hand: 'left' },
  { note: 'G3', displayName: 'G', fingerNumber: 1, hand: 'left' },
  { note: 'A3', displayName: 'A', hand: 'left' },
  { note: 'B3', displayName: 'B', hand: 'left' },
];

export const sampleLevels: Level[] = [
  {
    id: 'lvl-0a-teoria-fundamentos',
    title: 'curriculum.lvl0Teoria.title',
    subtitle: 'curriculum.lvl0Teoria.subtitle',
    stage: 'curriculum.stage0.title',
    role: 'fundamentos',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Antes de empezar',
        instructionText:
          'El Do central (C4) es el Do más cercano al centro del teclado — normalmente justo debajo del logo del fabricante. Es el punto de referencia de todo el método: casi todo lo que aprendas parte de ahí.',
        illustration: { kind: 'keyboard', highlightNotes: ['C4'], markMiddleC: true },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Posición de la mano',
        instructionText:
          'Coloca la mano derecha sobre las 5 teclas blancas a partir del Do central, con los dedos curvados y relajados. Cada dedo tiene un número: 1 = pulgar, 2 = índice, 3 = medio, 4 = anular, 5 = meñique.',
        illustration: { kind: 'hand', side: 'right' },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Dos formas de nombrar las notas',
        instructionText:
          'En español usamos Do-Re-Mi-Fa-Sol-La-Si. En inglés (y en la notación que verás en cancioneros, apps y partituras) se usan letras: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B. Son la misma nota — dos nombres distintos. Esta es la última vez que ves los nombres en español: apréndete bien esta tabla, porque de aquí en adelante — en esta lección, en el resto de la app, en los acordes y en las canciones — todo se nombra solo con letras. Es un requisito para seguir, no un dato de más.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Un poco más lejos: A y B',
        instructionText:
          'Después de las 5 notas de la posición básica (C a G), A y B quedan justo a continuación. Todavía no te preocupes por qué dedo usar — solo identifica dónde están, ya vendrá la digitación más adelante.',
        illustration: { kind: 'keyboard', highlightNotes: ['A4', 'B4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora la mano izquierda',
        instructionText:
          'La mano izquierda se coloca una octava más abajo. El meñique (5) va en el C grave, y el pulgar (1) queda en el G más cercano al C central — los dos pulgares casi se tocan en el medio del teclado.',
        illustration: { kind: 'hand', side: 'left' },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'También hay A y B graves',
        instructionText: 'Igual que con la derecha, sigue contando hacia la derecha desde el G grave para encontrar A y B.',
        illustration: { kind: 'keyboard', highlightNotes: ['A3', 'B3'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Lo que viene: práctica',
        instructionText:
          'Ya viste todo lo que necesitas. Primero practicas identificando notas con la mano derecha, y luego con la izquierda — sin más explicaciones de por medio, para que puedas repetirlo las veces que quieras sin releer la teoría. Los acordes vienen más adelante — por ahora es solo notas.',
      },
    ],
  },
  {
    id: 'lvl-1a-notas-derecha',
    title: 'curriculum.lvl1aNotasDerecha.title',
    subtitle: 'curriculum.lvl1aNotasDerecha.subtitle',
    stage: 'curriculum.stage1.title',
    role: 'melodia',
    steps: [
      {
        kind: 'note',
        expectedNotes: ['C4'],
        instructionText: 'Toca C con el pulgar',
        displayName: 'C',
        fingerNumber: 1,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['D4'],
        instructionText: 'Toca D con el índice',
        displayName: 'D',
        fingerNumber: 2,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['E4'],
        instructionText: 'Toca E con el dedo medio',
        displayName: 'E',
        fingerNumber: 3,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['F4'],
        instructionText: 'Toca F con el anular',
        displayName: 'F',
        fingerNumber: 4,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['G4'],
        instructionText: 'Toca G con el meñique',
        displayName: 'G',
        fingerNumber: 5,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['A4'],
        instructionText: 'Toca A, justo después de G',
        displayName: 'A',
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['B4'],
        instructionText: 'Toca B, justo después de A',
        displayName: 'B',
        hand: 'right',
      },
    ],
    // El repaso ("Identifica…") se genera al azar en cada intento —
    // distinto orden y distintas notas cada vez que se entra o se repite
    // el nivel, en vez de la misma secuencia memorizable.
    practicePool: { notes: rightHandNotePool, noteQuizCount: 10 },
  },
  {
    id: 'lvl-1b-notas-izquierda',
    title: 'curriculum.lvl1bNotasIzquierda.title',
    subtitle: 'curriculum.lvl1bNotasIzquierda.subtitle',
    stage: 'curriculum.stage1.title',
    role: 'melodia',
    steps: [
      {
        kind: 'note',
        expectedNotes: ['C3'],
        instructionText: 'Toca C grave con el meñique izquierdo',
        displayName: 'C',
        fingerNumber: 5,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['D3'],
        instructionText: 'Toca D con el anular izquierdo',
        displayName: 'D',
        fingerNumber: 4,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['E3'],
        instructionText: 'Toca E con el dedo medio izquierdo',
        displayName: 'E',
        fingerNumber: 3,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['F3'],
        instructionText: 'Toca F con el índice izquierdo',
        displayName: 'F',
        fingerNumber: 2,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['G3'],
        instructionText: 'Toca G con el pulgar izquierdo',
        displayName: 'G',
        fingerNumber: 1,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['A3'],
        instructionText: 'Toca A grave',
        displayName: 'A',
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['B3'],
        instructionText: 'Toca B grave',
        displayName: 'B',
        hand: 'left',
      },
    ],
    practicePool: { notes: leftHandNotePool, noteQuizCount: 10 },
  },
  {
    id: 'lvl-1c-melodia',
    title: 'curriculum.lvl1cMelodia.title',
    subtitle: 'curriculum.lvl1cMelodia.subtitle',
    stage: 'curriculum.stage1.title',
    role: 'melodia',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Tu primera canción',
        instructionText:
          'Ya sabes ubicar cada nota — ahora vas a usarlas para tocar música de verdad. A diferencia de la práctica anterior (una nota al azar cada vez), acá las notas van en un orden fijo: es "Sublime Gracia", nota por nota, con la mano derecha.',
      },
      { kind: 'note', expectedNotes: ['G4'], instructionText: 'Primera nota: G', displayName: 'G', hand: 'right' },
      { kind: 'note', expectedNotes: ['C5'], instructionText: 'Sube a C', displayName: 'C', hand: 'right' },
      { kind: 'note', expectedNotes: ['E5'], instructionText: 'Sube a E', displayName: 'E', hand: 'right' },
      { kind: 'note', expectedNotes: ['D5'], instructionText: 'Baja a D', displayName: 'D', hand: 'right' },
      { kind: 'note', expectedNotes: ['C5'], instructionText: 'Baja a C', displayName: 'C', hand: 'right' },
      { kind: 'note', expectedNotes: ['A4'], instructionText: 'Baja a A', displayName: 'A', hand: 'right' },
      { kind: 'note', expectedNotes: ['G4'], instructionText: 'Baja a G', displayName: 'G', hand: 'right' },
      { kind: 'note', expectedNotes: ['E4'], instructionText: 'Termina en E', displayName: 'E', hand: 'right' },
    ],
  },
  {
    id: 'lvl-2a-teoria-acordes',
    title: 'curriculum.lvl2Teoria.title',
    subtitle: 'curriculum.lvl2Teoria.subtitle',
    stage: 'curriculum.stage2.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Recuerda: notación americana',
        instructionText:
          'Ya viste que las notas se nombran con letras (C, D, E...). Los acordes usan el mismo sistema: una letra sola (como "C") es acorde mayor; letra + "m" (como "Am") es acorde menor.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Qué es un acorde?',
        instructionText:
          'Un acorde es un grupo de 3 o más notas que suenan juntas y forman un color armónico. En vez de tocar una melodía nota por nota, con acordes puedes acompañar una canción completa — es la base para tocar de oído en la iglesia.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo se forma una triada',
        instructionText:
          'La triada más simple se arma así: tomas una nota fundamental, saltas una tecla blanca para la tercera, y saltas otra para la quinta. Desde C: C (fundamental) → E (tercera) → G (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['C4', 'E4', 'G4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Los 7 acordes mayores',
        instructionText:
          'Hay un acorde mayor posible desde cada una de las 7 notas naturales: C, D, E, F, G, A y B. C, F y G se arman solo con teclas blancas; D, E, A y B necesitan una tecla negra en la tercera para sonar realmente mayores — si no, suenan menores.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'C mayor',
        instructionText: 'C (fundamental) → E (tercera) → G (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['C4', 'E4', 'G4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'D mayor',
        instructionText: 'D (fundamental) → F# (tercera) → A (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['D4', 'F#4', 'A4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'E mayor',
        instructionText: 'E (fundamental) → G# (tercera) → B (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['E4', 'G#4', 'B4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'F mayor',
        instructionText: 'F (fundamental) → A (tercera) → C (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['F4', 'A4', 'C5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'G mayor',
        instructionText: 'G (fundamental) → B (tercera) → D (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['G4', 'B4', 'D5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'A mayor',
        instructionText: 'A (fundamental) → C# (tercera) → E (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['A4', 'C#5', 'E5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'B mayor',
        instructionText: 'B (fundamental) → D# (tercera) → F# (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['B4', 'D#5', 'F#5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo vas a practicar',
        instructionText:
          'Toca las 3 notas del acorde en tu piano (o en el teclado táctil), todas juntas, tal como sonaría de verdad. El micrófono va escuchando y acumulando las notas que detecta hasta reconocer que sonó el acorde completo — no importa el orden ni si quedan perfectamente sincronizadas. Primero con la mano derecha, luego con la izquierda en una lección aparte. Los 7 acordes salen en orden al azar, y distinto cada vez que repitas.',
      },
    ],
  },
  {
    id: 'lvl-2b-practica-derecha',
    title: 'curriculum.lvl2PracticaDerecha.title',
    subtitle: 'curriculum.lvl2PracticaDerecha.subtitle',
    stage: 'curriculum.stage2.title',
    role: 'acordes',
    steps: [],
    // Los 7 acordes mayores salen en orden al azar y distinto en cada
    // intento (incluyendo "repetir nivel").
    practicePool: {
      chords: [
        { notes: ['C4', 'E4', 'G4'], displayName: 'C' },
        { notes: ['D4', 'F#4', 'A4'], displayName: 'D' },
        { notes: ['E4', 'G#4', 'B4'], displayName: 'E' },
        { notes: ['F4', 'A4', 'C5'], displayName: 'F' },
        { notes: ['G4', 'B4', 'D5'], displayName: 'G' },
        { notes: ['A4', 'C#5', 'E5'], displayName: 'A' },
        { notes: ['B4', 'D#5', 'F#5'], displayName: 'B' },
      ],
    },
  },
  {
    id: 'lvl-2c-practica-izquierda',
    title: 'curriculum.lvl2PracticaIzquierda.title',
    subtitle: 'curriculum.lvl2PracticaIzquierda.subtitle',
    stage: 'curriculum.stage2.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora con la mano izquierda',
        instructionText: 'Los mismos 7 acordes mayores, una octava más abajo — útil para acompañar mientras la derecha toca la melodía.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['C3', 'E3', 'G3'], displayName: 'C' },
        { notes: ['D3', 'F#3', 'A3'], displayName: 'D' },
        { notes: ['E3', 'G#3', 'B3'], displayName: 'E' },
        { notes: ['F3', 'A3', 'C4'], displayName: 'F' },
        { notes: ['G3', 'B3', 'D4'], displayName: 'G' },
        { notes: ['A3', 'C#4', 'E4'], displayName: 'A' },
        { notes: ['B3', 'D#4', 'F#4'], displayName: 'B' },
      ],
    },
  },
  {
    id: 'lvl-3a-teoria-menores',
    title: 'curriculum.lvl3aTeoriaMenores.title',
    subtitle: 'curriculum.lvl3aTeoriaMenores.subtitle',
    stage: 'curriculum.stage3.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Qué hace menor a un acorde?',
        instructionText:
          'Misma fórmula que un acorde mayor (fundamental, tercera, quinta), pero con la tercera un semitono más abajo — esa sola nota es lo que cambia el color de brillante a melancólico. Igual que con los mayores, hay un acorde menor posible desde cada una de las 7 notas naturales.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cm',
        instructionText: 'C (fundamental) → D# (tercera) → G (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['C4', 'D#4', 'G4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Dm',
        instructionText: 'D (fundamental) → F (tercera) → A (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['D4', 'F4', 'A4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Em',
        instructionText: 'E (fundamental) → G (tercera) → B (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['E4', 'G4', 'B4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Fm',
        instructionText: 'F (fundamental) → G# (tercera) → C (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['F4', 'G#4', 'C5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Gm',
        instructionText: 'G (fundamental) → A# (tercera) → D (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['G4', 'A#4', 'D5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Am',
        instructionText: 'A (fundamental) → C (tercera) → E (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['A4', 'C5', 'E5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Bm',
        instructionText: 'B (fundamental) → D (tercera) → F# (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['B4', 'D5', 'F#5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Dónde los vas a ver?',
        instructionText:
          'Am, Dm y Em son los que más aparecen en cancioneros de alabanza (son los menores naturales de las tonalidades de C y G mayor) — pero los 7 son útiles según la tonalidad de cada canción.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo vas a practicar',
        instructionText:
          'Igual que con los mayores: las 3 notas juntas, con el micrófono o el teclado táctil. Primero con la mano derecha, luego con la izquierda en una lección aparte.',
      },
    ],
  },
  {
    id: 'lvl-3b-menores-derecha',
    title: 'curriculum.lvl3bMenoresDerecha.title',
    subtitle: 'curriculum.lvl3bMenoresDerecha.subtitle',
    stage: 'curriculum.stage3.title',
    role: 'acordes',
    steps: [],
    practicePool: {
      chords: [
        { notes: ['C4', 'D#4', 'G4'], displayName: 'Cm' },
        { notes: ['D4', 'F4', 'A4'], displayName: 'Dm' },
        { notes: ['E4', 'G4', 'B4'], displayName: 'Em' },
        { notes: ['F4', 'G#4', 'C5'], displayName: 'Fm' },
        { notes: ['G4', 'A#4', 'D5'], displayName: 'Gm' },
        { notes: ['A4', 'C5', 'E5'], displayName: 'Am' },
        { notes: ['B4', 'D5', 'F#5'], displayName: 'Bm' },
      ],
    },
  },
  {
    id: 'lvl-3c-menores-izquierda',
    title: 'curriculum.lvl3cMenoresIzquierda.title',
    subtitle: 'curriculum.lvl3cMenoresIzquierda.subtitle',
    stage: 'curriculum.stage3.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora con la mano izquierda',
        instructionText: 'Los mismos 7 acordes menores, una octava más abajo.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['C3', 'D#3', 'G3'], displayName: 'Cm' },
        { notes: ['D3', 'F3', 'A3'], displayName: 'Dm' },
        { notes: ['E3', 'G3', 'B3'], displayName: 'Em' },
        { notes: ['F3', 'G#3', 'C4'], displayName: 'Fm' },
        { notes: ['G3', 'A#3', 'D4'], displayName: 'Gm' },
        { notes: ['A3', 'C4', 'E4'], displayName: 'Am' },
        { notes: ['B3', 'D4', 'F#4'], displayName: 'Bm' },
      ],
    },
  },
  {
    id: 'lvl-4a-teoria-sostenidos',
    title: 'curriculum.lvl4aTeoriaSostenidos.title',
    subtitle: 'curriculum.lvl4aTeoriaSostenidos.subtitle',
    stage: 'curriculum.stage4.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Los acordes que faltan',
        instructionText:
          'Ya tocaste los 7 acordes mayores con fundamental en tecla blanca. Faltan 5 con la fundamental sobre una tecla negra: C#, D#, F#, G#, A# — con esto completas los 12 acordes mayores posibles.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'C# mayor',
        instructionText: 'C# (fundamental) → F (tercera) → G# (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['C#4', 'F4', 'G#4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'D# mayor',
        instructionText: 'D# (fundamental) → G (tercera) → A# (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['D#4', 'G4', 'A#4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'F# mayor',
        instructionText: 'F# (fundamental) → A# (tercera) → C# (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['F#4', 'A#4', 'C#5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'G# mayor',
        instructionText: 'G# (fundamental) → C (tercera) → D# (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['G#4', 'C5', 'D#5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'A# mayor',
        instructionText: 'A# (fundamental) → D (tercera) → F (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['A#4', 'D5', 'F5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo vas a practicar',
        instructionText:
          'Igual que los demás: las 3 notas juntas, con el micrófono o el teclado táctil. Primero con la mano derecha, luego con la izquierda en una lección aparte.',
      },
    ],
  },
  {
    id: 'lvl-4b-sostenidos-derecha',
    title: 'curriculum.lvl4bSostenidosDerecha.title',
    subtitle: 'curriculum.lvl4bSostenidosDerecha.subtitle',
    stage: 'curriculum.stage4.title',
    role: 'acordes',
    steps: [],
    practicePool: {
      chords: [
        { notes: ['C#4', 'F4', 'G#4'], displayName: 'C#' },
        { notes: ['D#4', 'G4', 'A#4'], displayName: 'D#' },
        { notes: ['F#4', 'A#4', 'C#5'], displayName: 'F#' },
        { notes: ['G#4', 'C5', 'D#5'], displayName: 'G#' },
        { notes: ['A#4', 'D5', 'F5'], displayName: 'A#' },
      ],
    },
  },
  {
    id: 'lvl-4c-sostenidos-izquierda',
    title: 'curriculum.lvl4cSostenidosIzquierda.title',
    subtitle: 'curriculum.lvl4cSostenidosIzquierda.subtitle',
    stage: 'curriculum.stage4.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora con la mano izquierda',
        instructionText: 'Los mismos 5 acordes con sostenido, una octava más abajo — con esto completas los 12 acordes mayores en ambas manos.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['C#3', 'F3', 'G#3'], displayName: 'C#' },
        { notes: ['D#3', 'G3', 'A#3'], displayName: 'D#' },
        { notes: ['F#3', 'A#3', 'C#4'], displayName: 'F#' },
        { notes: ['G#3', 'C4', 'D#4'], displayName: 'G#' },
        { notes: ['A#3', 'D4', 'F4'], displayName: 'A#' },
      ],
    },
  },
  {
    id: 'lvl-5a-teoria-inversiones',
    title: 'curriculum.lvl5aTeoriaInversiones.title',
    subtitle: 'curriculum.lvl5aTeoriaInversiones.subtitle',
    stage: 'curriculum.stage5.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Qué es una inversión?',
        instructionText:
          'Un acorde tiene 3 notas, pero no siempre hay que tocarlas en el mismo orden. Si mueves la fundamental una octava arriba, las mismas 3 notas quedan en un orden distinto — es el mismo acorde, con otra nota como la más grave (el "bajo"). Sigue siendo C, G, F o Am — solo cambia qué nota queda abajo.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Así se escribe: C/E',
        instructionText:
          'En un cancionero vas a ver acordes como "C/E" — se lee "C con E en el bajo". La letra antes de la barra es el acorde; la de después es la nota que va abajo. "C/E" es la primera inversión de C; "C/G" es la segunda.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Primera inversión',
        instructionText: 'La tercera pasa a ser la nota más grave. En C mayor: E (bajo) → G → C — es decir, C/E.',
        illustration: { kind: 'keyboard', highlightNotes: ['E4', 'G4', 'C5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Segunda inversión',
        instructionText: 'La quinta pasa a ser la nota más grave. En C mayor: G (bajo) → C → E — es decir, C/G.',
        illustration: { kind: 'keyboard', highlightNotes: ['G4', 'C5', 'E5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Para qué sirve?',
        instructionText:
          'Las inversiones evitan saltos grandes de la mano al cambiar de acorde — la nota más cercana del acorde siguiente queda a la mano, y la progresión suena más suave. Es lo que hace que un acompañamiento se sienta fluido en vez de "saltado".',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo vas a practicar',
        instructionText:
          'Vas a practicar la primera y segunda inversión de los 4 acordes que ya conoces — C, F, G y Am. Primero con la mano derecha, luego con la izquierda en una lección aparte.',
      },
    ],
  },
  {
    id: 'lvl-5b-inversiones-derecha',
    title: 'curriculum.lvl5bInversionesDerecha.title',
    subtitle: 'curriculum.lvl5bInversionesDerecha.subtitle',
    stage: 'curriculum.stage5.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Practica con la mano derecha',
        instructionText:
          'Las mismas 3 notas de cada acorde, empezando desde la nota indicada como bajo — no importa el orden exacto ni la octava, solo que suenen las 3. Salen en orden al azar, y distinto cada vez que repitas.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['E4', 'G4', 'C5'], displayName: 'C/E — 1ª inversión' },
        { notes: ['G4', 'C5', 'E5'], displayName: 'C/G — 2ª inversión' },
        { notes: ['A4', 'C5', 'F5'], displayName: 'F/A — 1ª inversión' },
        { notes: ['C5', 'F5', 'A5'], displayName: 'F/C — 2ª inversión' },
        { notes: ['B4', 'D5', 'G5'], displayName: 'G/B — 1ª inversión' },
        { notes: ['D5', 'G5', 'B5'], displayName: 'G/D — 2ª inversión' },
        { notes: ['C5', 'E5', 'A5'], displayName: 'Am/C — 1ª inversión' },
        { notes: ['E5', 'A5', 'C5'], displayName: 'Am/E — 2ª inversión' },
      ],
    },
  },
  {
    id: 'lvl-5c-inversiones-izquierda',
    title: 'curriculum.lvl5cInversionesIzquierda.title',
    subtitle: 'curriculum.lvl5cInversionesIzquierda.subtitle',
    stage: 'curriculum.stage5.title',
    role: 'acordes',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Practica con la mano izquierda',
        instructionText: 'Las mismas inversiones, ahora con la mano izquierda — útil para acompañar mientras la derecha toca la melodía.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['E3', 'G3', 'C4'], displayName: 'C/E — 1ª inversión' },
        { notes: ['G3', 'C4', 'E4'], displayName: 'C/G — 2ª inversión' },
        { notes: ['A3', 'C4', 'F4'], displayName: 'F/A — 1ª inversión' },
        { notes: ['C4', 'F4', 'A4'], displayName: 'F/C — 2ª inversión' },
        { notes: ['B3', 'D4', 'G4'], displayName: 'G/B — 1ª inversión' },
        { notes: ['D4', 'G4', 'B4'], displayName: 'G/D — 2ª inversión' },
        { notes: ['C4', 'E4', 'A4'], displayName: 'Am/C — 1ª inversión' },
        { notes: ['E4', 'A4', 'C4'], displayName: 'Am/E — 2ª inversión' },
      ],
    },
  },
  {
    id: 'lvl-6a-teoria-escalas',
    title: 'curriculum.lvl6aTeoriaEscalas.title',
    subtitle: 'curriculum.lvl6aTeoriaEscalas.subtitle',
    stage: 'curriculum.stage6.title',
    role: 'escalas',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Qué es una escala?',
        instructionText:
          'Una escala es el conjunto ordenado de notas del que salen las melodías y los acordes de una tonalidad. La escala de C mayor usa solo teclas blancas: C, D, E, F, G, A, B, C.',
        illustration: { kind: 'keyboard', highlightNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Tonos y semitonos',
        instructionText:
          'La distancia entre notas no siempre es igual: C-D, D-E, F-G, G-A y A-B son un tono completo (una tecla blanca de por medio); E-F y B-C son semitono (están pegadas, sin tecla negra entre ellas). Ese patrón (tono-tono-semitono-tono-tono-tono-semitono) es lo que define a CUALQUIER escala mayor, no solo la de C.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Se arma en dos mitades iguales',
        instructionText:
          'C-D-E-F y G-A-B-C siguen exactamente el mismo patrón (tono-tono-semitono), solo que empezando en una nota distinta. Por eso conviene practicarla en dos mitades antes de unirla completa.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo vas a practicar',
        instructionText:
          'Primero cada mitad por separado, luego la escala completa. Primero con la mano derecha, luego con la izquierda en una lección aparte. Salen en orden al azar, y distinto cada vez que repitas.',
      },
    ],
  },
  {
    id: 'lvl-6b-escalas-derecha',
    title: 'curriculum.lvl6bEscalasDerecha.title',
    subtitle: 'curriculum.lvl6bEscalasDerecha.subtitle',
    stage: 'curriculum.stage6.title',
    role: 'escalas',
    steps: [],
    practicePool: {
      chords: [
        { notes: ['C4', 'D4', 'E4', 'F4'], displayName: 'Primera mitad: C-D-E-F' },
        { notes: ['G4', 'A4', 'B4', 'C5'], displayName: 'Segunda mitad: G-A-B-C' },
        { notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], displayName: 'Escala completa de C mayor' },
      ],
    },
  },
  {
    id: 'lvl-6c-escalas-izquierda',
    title: 'curriculum.lvl6cEscalasIzquierda.title',
    subtitle: 'curriculum.lvl6cEscalasIzquierda.subtitle',
    stage: 'curriculum.stage6.title',
    role: 'escalas',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora con la mano izquierda',
        instructionText: 'La misma escala, una octava más abajo.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['C3', 'D3', 'E3', 'F3'], displayName: 'Primera mitad: C-D-E-F' },
        { notes: ['G3', 'A3', 'B3', 'C4'], displayName: 'Segunda mitad: G-A-B-C' },
        { notes: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'], displayName: 'Escala completa de C mayor' },
      ],
    },
  },
  {
    id: 'lvl-7a-teoria-tonalidades',
    title: 'curriculum.lvl7aTeoriaTonalidades.title',
    subtitle: 'curriculum.lvl7aTeoriaTonalidades.subtitle',
    stage: 'curriculum.stage7.title',
    role: 'tonalidades',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Qué es una tonalidad?',
        instructionText:
          'Una canción "en tonalidad de G" usa principalmente las notas y acordes de la escala de G mayor — G es su nota base ("tónica"), y ahí es donde la melodía se siente en reposo. Cada tonalidad tiene su propia escala y su propio grupo de acordes naturales.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'La armadura de clave',
        instructionText:
          'Cada tonalidad usa una cantidad fija de sostenidos (o bemoles) en TODA la escala, no solo en algunas notas — eso es lo que la distingue de C mayor (que no usa ninguno). G mayor usa 1 sostenido (F#) siempre; D mayor usa 2 (F# y C#) siempre.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Tonalidades más comunes en alabanza',
        instructionText:
          'G, D, A y C son las tonalidades que más vas a ver en cancioneros de iglesia — quedan cómodas para cantar y para acompañar con guitarra o piano. Vas a practicar las escalas de G y D, que sirven de base para tocar en esas tonalidades.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Escala de G mayor',
        instructionText: 'G-A-B-C-D-E-F#-G — mismo patrón tono-tono-semitono que cualquier escala mayor, con un solo sostenido: F#.',
        illustration: { kind: 'keyboard', highlightNotes: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Escala de D mayor',
        instructionText: 'D-E-F#-G-A-B-C#-D — dos sostenidos: F# y C#.',
        illustration: { kind: 'keyboard', highlightNotes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo vas a practicar',
        instructionText:
          'Igual que con la escala de C: cada mitad por separado, luego completa. Primero con la mano derecha, luego con la izquierda en una lección aparte.',
      },
    ],
  },
  {
    id: 'lvl-7b-tonalidades-derecha',
    title: 'curriculum.lvl7bTonalidadesDerecha.title',
    subtitle: 'curriculum.lvl7bTonalidadesDerecha.subtitle',
    stage: 'curriculum.stage7.title',
    role: 'tonalidades',
    steps: [],
    practicePool: {
      chords: [
        { notes: ['G4', 'A4', 'B4', 'C5'], displayName: 'G mayor — primera mitad' },
        { notes: ['D5', 'E5', 'F#5', 'G5'], displayName: 'G mayor — segunda mitad' },
        { notes: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'], displayName: 'Escala completa de G mayor' },
        { notes: ['D4', 'E4', 'F#4', 'G4'], displayName: 'D mayor — primera mitad' },
        { notes: ['A4', 'B4', 'C#5', 'D5'], displayName: 'D mayor — segunda mitad' },
        { notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'], displayName: 'Escala completa de D mayor' },
      ],
    },
  },
  {
    id: 'lvl-7c-tonalidades-izquierda',
    title: 'curriculum.lvl7cTonalidadesIzquierda.title',
    subtitle: 'curriculum.lvl7cTonalidadesIzquierda.subtitle',
    stage: 'curriculum.stage7.title',
    role: 'tonalidades',
    steps: [
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora con la mano izquierda',
        instructionText: 'Las mismas escalas, una octava más abajo.',
      },
    ],
    practicePool: {
      chords: [
        { notes: ['G3', 'A3', 'B3', 'C4'], displayName: 'G mayor — primera mitad' },
        { notes: ['D4', 'E4', 'F#4', 'G4'], displayName: 'G mayor — segunda mitad' },
        { notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4'], displayName: 'Escala completa de G mayor' },
        { notes: ['D3', 'E3', 'F#3', 'G3'], displayName: 'D mayor — primera mitad' },
        { notes: ['A3', 'B3', 'C#4', 'D4'], displayName: 'D mayor — segunda mitad' },
        { notes: ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4'], displayName: 'Escala completa de D mayor' },
      ],
    },
  },
  {
    id: 'lvl-7-ritmo',
    title: 'curriculum.lvl7Ritmo.title',
    subtitle: 'curriculum.lvl7Ritmo.subtitle',
    stage: 'curriculum.stage8.title',
    role: 'ritmo',
    steps: [],
  },
  {
    id: 'lvl-8-oido',
    title: 'curriculum.lvl8Oido.title',
    subtitle: 'curriculum.lvl8Oido.subtitle',
    stage: 'curriculum.stage9.title',
    role: 'oido',
    steps: [],
  },
  {
    id: 'lvl-9-repertorio',
    title: 'curriculum.lvl9Repertorio.title',
    subtitle: 'curriculum.lvl9Repertorio.subtitle',
    stage: 'curriculum.stage10.title',
    role: 'repertorio',
    steps: [],
  },
  {
    id: 'lvl-99-lectura',
    title: 'curriculum.lvl99Lectura.title',
    subtitle: 'curriculum.lvl99Lectura.subtitle',
    stage: 'curriculum.stage99.title',
    role: 'lectura',
    steps: [],
  },
];

export const sampleSongs: Song[] = [
  {
    id: 'song-sublime-gracia',
    title: 'curriculum.songSublimeGracia',
    source: 'dominio_publico',
    licenseStatus: 'pendiente_revision_humana',
    licenseInfo:
      'Melodía e himno de dominio público (Amazing Grace); arreglo específico pendiente de confirmación por un humano antes de publicar.',
    levelIds: ['lvl-1c-melodia', 'lvl-2b-practica-derecha'],
  },
  {
    id: 'song-cuan-grande-es-el',
    title: 'curriculum.songCuanGrandeEsEl',
    source: 'dominio_publico',
    licenseStatus: 'pendiente_revision_humana',
    licenseInfo:
      'Himno de dominio público (How Great Thou Art); arreglo específico pendiente de confirmación por un humano antes de publicar. Todavía sin lección práctica asociada.',
    levelIds: [],
  },
  {
    id: 'song-grande-es-tu-fidelidad',
    title: 'curriculum.songGrandeEsTuFidelidad',
    source: 'dominio_publico',
    licenseStatus: 'pendiente_revision_humana',
    licenseInfo:
      'Himno de dominio público (Great Is Thy Faithfulness); arreglo específico pendiente de confirmación por un humano antes de publicar. Todavía sin lección práctica asociada.',
    levelIds: [],
  },
];

// Progreso inicial de un usuario nuevo: nada completado todavía, empieza en
// la primera etapa. (Antes arrancaba en "Acordes básicos" por datos de
// ejemplo que simulaban progreso ya avanzado — confuso para una primera
// prueba real.)
export const sampleUserProgress: UserProgress = {
  completedLevelIds: [],
  chordsLearned: [],
  stepProgress: {},
  practiceDates: [],
};
