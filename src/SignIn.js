import { Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { auth, Firebase } from './firebase';
import MiniLayout from './MiniLayout';

const providers = [
  {
    id: 'google',
    label: 'Google',
    signIn: () => {
      const provider = new Firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    },
  },
  {
    id: 'github',
    label: 'GitHub',
    signIn: () => {
      const provider = new Firebase.auth.GithubAuthProvider();
      auth.signInWithPopup(provider);
    },
  },
];

export default function SignIn() {
  return (
    <MiniLayout>
      <Typography variant="h1">drivr</Typography>
      <Grid container spacing={2}>
        {providers.map((provider) => (
          <Grid item xs={12} key={provider.id}>
            <Button color="primary" variant="contained" fullWidth onClick={provider.signIn}>
              Sign in with {provider.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </MiniLayout>
  );
}
