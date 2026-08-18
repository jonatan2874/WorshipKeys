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
  { key: 'curriculum.stage99.title', number: '99' },
];

/** Las 7 notas de la posición básica de la mano derecha — pool para el
 * repaso al azar de "Práctica notas: Mano derecha". */
const rightHandNotePool: NotePoolItem[] = [
  { note: 'C4', displayName: 'Do', fingerNumber: 1, hand: 'right' },
  { note: 'D4', displayName: 'Re', fingerNumber: 2, hand: 'right' },
  { note: 'E4', displayName: 'Mi', fingerNumber: 3, hand: 'right' },
  { note: 'F4', displayName: 'Fa', fingerNumber: 4, hand: 'right' },
  { note: 'G4', displayName: 'Sol', fingerNumber: 5, hand: 'right' },
  { note: 'A4', displayName: 'La', hand: 'right' },
  { note: 'B4', displayName: 'Si', hand: 'right' },
];

/** Las 7 notas de la posición básica de la mano izquierda — pool para el
 * repaso al azar de "Práctica notas: Mano izquierda". */
const leftHandNotePool: NotePoolItem[] = [
  { note: 'C3', displayName: 'Do', fingerNumber: 5, hand: 'left' },
  { note: 'D3', displayName: 'Re', fingerNumber: 4, hand: 'left' },
  { note: 'E3', displayName: 'Mi', fingerNumber: 3, hand: 'left' },
  { note: 'F3', displayName: 'Fa', fingerNumber: 2, hand: 'left' },
  { note: 'G3', displayName: 'Sol', fingerNumber: 1, hand: 'left' },
  { note: 'A3', displayName: 'La', hand: 'left' },
  { note: 'B3', displayName: 'Si', hand: 'left' },
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
          'En español usamos Do-Re-Mi-Fa-Sol-La-Si. En inglés (y en la notación que verás en apps y partituras) se usan letras: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B. Son la misma nota — dos nombres distintos. Aquí vas a ver ambos juntos, así te acostumbras a los dos.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Un poco más lejos: La y Si',
        instructionText:
          'Después de las 5 notas de la posición básica (Do a Sol), La (A) y Si (B) quedan justo a continuación. Todavía no te preocupes por qué dedo usar — solo identifica dónde están, ya vendrá la digitación más adelante.',
        illustration: { kind: 'keyboard', highlightNotes: ['A4', 'B4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Ahora la mano izquierda',
        instructionText:
          'La mano izquierda se coloca una octava más abajo. El meñique (5) va en el Do grave, y el pulgar (1) queda en el Sol más cercano al Do central — los dos pulgares casi se tocan en el medio del teclado.',
        illustration: { kind: 'hand', side: 'left' },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'También hay La y Si graves',
        instructionText:
          'Igual que con la derecha, sigue contando hacia la derecha desde el Sol grave para encontrar La y Si.',
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
    id: 'lvl-0b-practica-derecha',
    title: 'curriculum.lvl0PracticaDerecha.title',
    subtitle: 'curriculum.lvl0PracticaDerecha.subtitle',
    stage: 'curriculum.stage0.title',
    role: 'fundamentos',
    steps: [
      {
        kind: 'note',
        expectedNotes: ['C4'],
        instructionText: 'Toca Do (C) con el pulgar',
        displayName: 'Do',
        fingerNumber: 1,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['D4'],
        instructionText: 'Toca Re (D) con el índice',
        displayName: 'Re',
        fingerNumber: 2,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['E4'],
        instructionText: 'Toca Mi (E) con el dedo medio',
        displayName: 'Mi',
        fingerNumber: 3,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['F4'],
        instructionText: 'Toca Fa (F) con el anular',
        displayName: 'Fa',
        fingerNumber: 4,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['G4'],
        instructionText: 'Toca Sol (G) con el meñique',
        displayName: 'Sol',
        fingerNumber: 5,
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['A4'],
        instructionText: 'Toca La (A), justo después de Sol',
        displayName: 'La',
        hand: 'right',
      },
      {
        kind: 'note',
        expectedNotes: ['B4'],
        instructionText: 'Toca Si (B), justo después de La',
        displayName: 'Si',
        hand: 'right',
      },
    ],
    // El repaso ("Identifica…") se genera al azar en cada intento —
    // distinto orden y distintas notas cada vez que se entra o se repite
    // el nivel, en vez de la misma secuencia memorizable.
    practicePool: { notes: rightHandNotePool, noteQuizCount: 10 },
  },
  {
    id: 'lvl-0c-practica-izquierda',
    title: 'curriculum.lvl0PracticaIzquierda.title',
    subtitle: 'curriculum.lvl0PracticaIzquierda.subtitle',
    stage: 'curriculum.stage0.title',
    role: 'fundamentos',
    steps: [
      {
        kind: 'note',
        expectedNotes: ['C3'],
        instructionText: 'Toca Do grave (C) con el meñique izquierdo',
        displayName: 'Do',
        fingerNumber: 5,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['D3'],
        instructionText: 'Toca Re (D) con el anular izquierdo',
        displayName: 'Re',
        fingerNumber: 4,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['E3'],
        instructionText: 'Toca Mi (E) con el dedo medio izquierdo',
        displayName: 'Mi',
        fingerNumber: 3,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['F3'],
        instructionText: 'Toca Fa (F) con el índice izquierdo',
        displayName: 'Fa',
        fingerNumber: 2,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['G3'],
        instructionText: 'Toca Sol (G) con el pulgar izquierdo',
        displayName: 'Sol',
        fingerNumber: 1,
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['A3'],
        instructionText: 'Toca La grave (A)',
        displayName: 'La',
        hand: 'left',
      },
      {
        kind: 'note',
        expectedNotes: ['B3'],
        instructionText: 'Toca Si grave (B)',
        displayName: 'Si',
        hand: 'left',
      },
    ],
    practicePool: { notes: leftHandNotePool, noteQuizCount: 10 },
  },
  {
    id: 'lvl-1-melodia',
    title: 'curriculum.lvl1Melodia.title',
    subtitle: 'curriculum.lvl1Melodia.subtitle',
    stage: 'curriculum.stage1.title',
    role: 'melodia',
    steps: [
      { kind: 'note', expectedNotes: ['G4'], instructionText: 'Primera nota: Sol', displayName: 'Sol', hand: 'right' },
      { kind: 'note', expectedNotes: ['C5'], instructionText: 'Sube a Do', displayName: 'Do', hand: 'right' },
      { kind: 'note', expectedNotes: ['E5'], instructionText: 'Sube a Mi', displayName: 'Mi', hand: 'right' },
      { kind: 'note', expectedNotes: ['D5'], instructionText: 'Baja a Re', displayName: 'Re', hand: 'right' },
      { kind: 'note', expectedNotes: ['C5'], instructionText: 'Baja a Do', displayName: 'Do', hand: 'right' },
      { kind: 'note', expectedNotes: ['A4'], instructionText: 'Baja a La', displayName: 'La', hand: 'right' },
      { kind: 'note', expectedNotes: ['G4'], instructionText: 'Baja a Sol', displayName: 'Sol', hand: 'right' },
      { kind: 'note', expectedNotes: ['E4'], instructionText: 'Termina en Mi', displayName: 'Mi', hand: 'right' },
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
        displayName: '¿Qué es un acorde?',
        instructionText:
          'Un acorde es un grupo de 3 o más notas que suenan juntas y forman un color armónico. En vez de tocar una melodía nota por nota, con acordes puedes acompañar una canción completa — es la base para tocar de oído en la iglesia.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Notación americana',
        instructionText:
          'De aquí en adelante los acordes se nombran con letras en vez de en español — es el mismo sistema que vas a ver en cualquier cancionero de iglesia: Do=C, Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B. Una letra sola (como "C") es acorde mayor; letra + "m" (como "Am") es acorde menor.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Cómo se forma una triada',
        instructionText:
          'La triada más simple se arma así: tomas una nota fundamental, saltas una tecla blanca para la tercera, y saltas otra para la quinta. Desde Do: Do (fundamental) → Mi (tercera) → Sol (quinta).',
        illustration: { kind: 'keyboard', highlightNotes: ['C4', 'E4', 'G4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Los 4 acordes de este nivel',
        instructionText:
          'Vas a aprender C (Do-Mi-Sol), G (Sol-Si-Re), F (Fa-La-Do) y Am (La-Do-Mi). Los mayores suenan brillantes; el menor suena más melancólico — misma fórmula, pero con la tercera un semitono más abajo.',
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: 'Primero, en bloque',
        instructionText:
          'En la práctica vas a tocar primero las 3 notas de cada acorde juntas, al mismo tiempo, con una mano — así es como sonará cuando acompañes de verdad. Esa parte usa el teclado táctil, porque el micrófono no puede escuchar varias notas a la vez.',
        illustration: { kind: 'keyboard', highlightNotes: ['C4', 'E4', 'G4'] },
      },
      {
        kind: 'info',
        expectedNotes: [],
        displayName: '¿Qué es arpegiar?',
        instructionText:
          'Arpegiar es tocar las notas de un acorde una por una en vez de todas juntas — como "desenrollar" el acorde. Es una técnica real que vas a usar para intros y rellenos, y también es la única forma en que el micrófono del teléfono puede reconocer un acorde: solo escucha una nota a la vez, así que si las tocas por separado las va acumulando hasta reconocer el acorde completo. Esa es la segunda parte de la práctica.',
      },
    ],
  },
  {
    id: 'lvl-2b-practica-acordes',
    title: 'curriculum.lvl2Practica.title',
    subtitle: 'curriculum.lvl2Practica.subtitle',
    stage: 'curriculum.stage2.title',
    role: 'acordes',
    steps: [],
    // Los 4 acordes se practican en bloque y luego arpegiados, pero en
    // orden al azar y distinto en cada intento (incluyendo "repetir nivel").
    // Nombres en notación americana (C/G/F/Am), consistente con el paso de
    // teoría "Notación americana" de lvl-2a.
    practicePool: {
      chords: [
        { notes: ['C4', 'E4', 'G4'], displayName: 'C' },
        { notes: ['G3', 'B3', 'D4'], displayName: 'G' },
        { notes: ['F3', 'A3', 'C4'], displayName: 'F' },
        { notes: ['A3', 'C4', 'E4'], displayName: 'Am' },
      ],
    },
  },
  {
    id: 'lvl-3-inversiones',
    title: 'curriculum.lvl3.title',
    subtitle: 'curriculum.lvl3.subtitle',
    stage: 'curriculum.stage3.title',
    role: 'acordes',
    steps: [],
  },
  {
    id: 'lvl-4-acordes-menores',
    title: 'curriculum.lvl4AcordesMenores.title',
    subtitle: 'curriculum.lvl4AcordesMenores.subtitle',
    stage: 'curriculum.stage4.title',
    role: 'acordes',
    steps: [],
  },
  {
    id: 'lvl-5-escalas',
    title: 'curriculum.lvl5Escalas.title',
    subtitle: 'curriculum.lvl5Escalas.subtitle',
    stage: 'curriculum.stage5.title',
    role: 'escalas',
    steps: [],
  },
  {
    id: 'lvl-6-tonalidades',
    title: 'curriculum.lvl6Tonalidades.title',
    subtitle: 'curriculum.lvl6Tonalidades.subtitle',
    stage: 'curriculum.stage6.title',
    role: 'tonalidades',
    steps: [],
  },
  {
    id: 'lvl-7-ritmo',
    title: 'curriculum.lvl7Ritmo.title',
    subtitle: 'curriculum.lvl7Ritmo.subtitle',
    stage: 'curriculum.stage7.title',
    role: 'ritmo',
    steps: [],
  },
  {
    id: 'lvl-8-oido',
    title: 'curriculum.lvl8Oido.title',
    subtitle: 'curriculum.lvl8Oido.subtitle',
    stage: 'curriculum.stage8.title',
    role: 'oido',
    steps: [],
  },
  {
    id: 'lvl-9-repertorio',
    title: 'curriculum.lvl9Repertorio.title',
    subtitle: 'curriculum.lvl9Repertorio.subtitle',
    stage: 'curriculum.stage9.title',
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
    levelIds: ['lvl-1-melodia', 'lvl-2b-practica-acordes'],
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
  currentStreak: 0,
  lastPracticeDate: null,
  chordsLearned: [],
  stepProgress: {},
  practiceDates: [],
};
