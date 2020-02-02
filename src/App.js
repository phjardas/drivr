import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Loading from './Loading';
import Pages from './pages';
import SignIn from './SignIn';

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <SignIn />;
  return <Pages />;
}
