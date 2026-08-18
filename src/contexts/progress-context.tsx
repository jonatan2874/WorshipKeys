import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, getFirestore, setDoc } from '@react-native-firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { sampleUserProgress } from '@/lib/curriculum/sample-data';
import { UserProgress } from '@/lib/curriculum/types';

import { useAuth } from './auth-context';

const STORAGE_KEY = 'worshipkeys.progress';

interface ProgressContextValue {
  progress: UserProgress;
  completeLevel: (levelId: string) => void;
  updateStepProgress: (levelId: string, stepIndex: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(sampleUserProgress);
  const syncedUidRef = useRef<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        setProgress({ ...sampleUserProgress, ...JSON.parse(raw) });
      } catch {
        // datos guardados corruptos: se ignora y se sigue con el progreso inicial.
      }
    });
  }, []);

  // Al iniciar sesión: si ya hay progreso en la nube para esta cuenta, lo
  // adopta (y lo guarda localmente); si es la primera vez, sube el progreso
  // local actual para no perder lo que ya se practicó sin sesión iniciada.
  useEffect(() => {
    if (!user) {
      syncedUidRef.current = null;
      return;
    }
    if (syncedUidRef.current === user.uid) return;
    syncedUidRef.current = user.uid;

    const ref = doc(getFirestore(), 'users', user.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const cloud = { ...sampleUserProgress, ...(snap.data() as Partial<UserProgress>) };
        setProgress(cloud);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloud));
      } else {
        setDoc(ref, progress);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function persist(next: UserProgress) {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (user) {
      setDoc(doc(getFirestore(), 'users', user.uid), next).catch(() => {
        // sin conexión u otro error transitorio: queda guardado localmente
        // y se reintentará en la próxima escritura.
      });
    }
  }

  // Día local ('YYYY-MM-DD') agregado a practiceDates si no estaba ya —
  // base real (no inventada) para el calendario semanal del perfil.
  function withPracticeToday(prev: UserProgress): UserProgress {
    const today = new Date().toLocaleDateString('sv-SE'); // 'sv-SE' da YYYY-MM-DD en hora local
    if (prev.practiceDates.includes(today)) return prev;
    return { ...prev, practiceDates: [...prev.practiceDates, today] };
  }

  function completeLevel(levelId: string) {
    setProgress((prev) => {
      const next: UserProgress = {
        ...withPracticeToday(prev),
        completedLevelIds: prev.completedLevelIds.includes(levelId)
          ? prev.completedLevelIds
          : [...prev.completedLevelIds, levelId],
        lastPracticeDate: new Date().toISOString(),
      };
      persist(next);
      return next;
    });
  }

  function updateStepProgress(levelId: string, stepIndex: number) {
    setProgress((prev) => {
      if ((prev.stepProgress[levelId] ?? 0) >= stepIndex) return prev;
      const next: UserProgress = {
        ...withPracticeToday(prev),
        stepProgress: { ...prev.stepProgress, [levelId]: stepIndex },
      };
      persist(next);
      return next;
    });
  }

  return (
    <ProgressContext.Provider value={{ progress, completeLevel, updateStepProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
