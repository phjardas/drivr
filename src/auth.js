import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useAnalytics } from './analytics';
import { version } from './config';
import { auth, Firebase, firestore } from './firebase';
import Loading from './Loading';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const ga = useAnalytics();
  const [user, loading, error] = useAuthState(auth);
  ga.set({ userId: user ? user.uid : undefined });

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <Loading />;

  return user ? <AuthenticatedProvider user={user}>{children}</AuthenticatedProvider> : <AnonymousProvider>{children}</AnonymousProvider>;
}

function AnonymousProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

function AuthenticatedProvider({ user: fbUser, children }) {
  const userDoc = useMemo(() => firestore.collection('users').doc(fbUser.uid), [fbUser.uid]);
  const [{ initialized, user, loading, error }, setState] = useState({ loading: true });
  const [data, fbLoading, fbError] = useDocument(userDoc);

  useEffect(() => {
    async function initialize() {
      if (!fbLoading && !fbError && !initialized) {
        setState((s) => ({ ...s, initialized: true }));

        if (data) {
          await userDoc.update({
            lastLogin: Firebase.firestore.FieldValue.serverTimestamp(),
            appVersion: version,
          });
        } else {
          await userDoc.set({
            label: fbUser.displayName,
            photoURL: fbUser.photoURL,
            createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: Firebase.firestore.FieldValue.serverTimestamp(),
            appVersion: version,
          });
        }
      }
    }

    initialize();
  }, [fbUser, fbLoading, fbError, data, initialized, setState, userDoc]);

  useEffect(() => {
    if (initialized && data) {
      setState({ loading: false, initialized: true, user: { ...data.data(), id: fbUser.uid } });
    }
  }, [initialized, data, fbUser.uid]);

  const context = useMemo(() => ({ user, token: fbUser.getIdToken(), signOut: () => auth.signOut() }), [user, fbUser]);

  if (error) return <div>Error: {error.message}</div>;
  if (fbError) return <div>Error: {fbError.message}</div>;
  if (loading) return <Loading />;

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
