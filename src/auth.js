import React, { createContext, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAnalytics } from './analytics';
import { auth } from './firebase';
import Loading from './Loading';
import SignIn from './SignIn';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const ga = useAnalytics();
  const [fbUser, loading, error] = useAuthState(auth);
  ga.set({ userId: fbUser ? fbUser.uid : undefined });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!fbUser) return <SignIn />;

  const user = {
    id: fbUser.uid,
    displayName: fbUser.displayName,
    email: fbUser.email,
    photoURL: fbUser.photoURL,
  };

  return <AuthContext.Provider value={{ user, signOut: () => auth.signOut() }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
