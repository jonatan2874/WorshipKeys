import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'worshipkeys.onboarding';

export type SkillLevel = 'nunca' | 'basico' | 'soltura';

interface OnboardingState {
  complete: boolean;
  skillLevel: SkillLevel | null;
  goals: string[];
}

interface OnboardingContextValue extends OnboardingState {
  /** true mientras se carga el estado guardado — evita un parpadeo hacia
   * "bienvenida" antes de saber si ya se completó antes. */
  loading: boolean;
  /** Solo personaliza el saludo — el desbloqueo del currículo sigue siendo
   * lineal en orden, no cambia según esta selección. */
  completeOnboarding: (skillLevel: SkillLevel, goals: string[]) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<OnboardingState>({ complete: false, skillLevel: null, goals: [] });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setState(JSON.parse(raw));
          } catch {
            // dato guardado corrupto: se ignora y se sigue con el estado inicial.
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function completeOnboarding(skillLevel: SkillLevel, goals: string[]) {
    const next: OnboardingState = { complete: true, skillLevel, goals };
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <OnboardingContext.Provider value={{ ...state, loading, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
