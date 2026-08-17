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

// client_id (client_type: 3, "Web client") del google-services.json — es el
// que Firebase usa para verificar el idToken del lado del servidor.
GoogleSignin.configure({
  webClientId: '755570463340-t31rppf92lqab01nutit7qr9he978b5l.apps.googleusercontent.com',
});

interface AuthContextValue {
  user: FirebaseUser | null;
  initializing: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
  }, []);

  async function signInWithGoogle() {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success' || !response.data.idToken) {
      return;
    }
    const credential = GoogleAuthProvider.credential(response.data.idToken);
    await signInWithCredential(getAuth(), credential);
  }

  async function signOut() {
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
