import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// client_id (client_type: 3, "Web client") del google-services.json — es el
// que Firebase usa para verificar el idToken del lado del servidor.
// @react-native-firebase no soporta web (no hay initializeApp del lado del
// bundle web), así que en web se omite por completo y el resto de la app
// queda navegable para pruebas rápidas en el navegador.
if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: '755570463340-t31rppf92lqab01nutit7qr9he978b5l.apps.googleusercontent.com',
  });
}

interface AuthContextValue {
  user: FirebaseUser | null;
  initializing: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  // En web no hay Firebase nativo que inicialice — no queda "cargando" para
  // siempre, arranca ya resuelto (sin usuario).
  const [initializing, setInitializing] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') return;
    return onAuthStateChanged(getAuth(), (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
  }, []);

  async function signInWithGoogle() {
    if (Platform.OS === 'web') {
      throw new Error('El inicio de sesión con Google solo está disponible en la app nativa.');
    }
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success' || !response.data.idToken) {
      return;
    }
    const credential = GoogleAuthProvider.credential(response.data.idToken);
    await signInWithCredential(getAuth(), credential);
  }

  async function signOut() {
    if (Platform.OS === 'web') return;
    await firebaseSignOut(getAuth());
    await GoogleSignin.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, initializing, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
