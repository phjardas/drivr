import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAnalytics } from './analytics';
import { auth, firestore, Firebase } from './firebase';
import Loading from './Loading';
import SignIn from './SignIn';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const ga = useAnalytics();
  const [fbUser, fbLoading, fbError] = useAuthState(auth);
  const [{ user, loading, error }, setState] = useState({ loading: true });
  ga.set({ userId: fbUser ? fbUser.uid : undefined });

  useEffect(() => {
    if (fbUser) {
      handleUser(fbUser)
        .then((u) => setState({ loading: false, user: u }))
        .catch((e) => setState({ loading: false, error: e }));
    } else {
      setState({ loading: fbLoading, error: fbError });
    }
  }, [fbUser, fbLoading, fbError, setState]);

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <Loading />;
  if (!user) return <SignIn />;

  return <AuthContext.Provider value={{ user, signOut: () => auth.signOut() }}>{children}</AuthContext.Provider>;
}

async function handleUser(fbUser) {
  const ref = await firestore.collection('users').doc(fbUser.uid);

  if ((await ref.get()).exists) {
    await ref.update({ lastLogin: Firebase.firestore.FieldValue.serverTimestamp() });
  } else {
    await ref.set({
      displayName: fbUser.displayName,
      email: fbUser.email,
      label: fbUser.displayName || fbUser.email,
      photoURL: fbUser.photoURL,
      createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: Firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  const doc = await ref.get();
  return { ...doc.data(), id: ref.id };
}

export function useAuth() {
  return useContext(AuthContext);
}
