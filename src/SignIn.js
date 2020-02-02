import { Button } from '@material-ui/core';
import React from 'react';
import { auth, Firebase } from './firebase';

const providers = [
  {
    id: 'google',
    label: 'Google',
    signIn: () => {
      const provider = new Firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    },
  },
];

export default function SignIn() {
  return (
    <>
      {providers.map((provider) => (
        <Button key={provider.id} color="primary" variant="contained" onClick={provider.signIn}>
          Sign in with {provider.label}
        </Button>
      ))}
    </>
  );
}
