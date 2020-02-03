import { CircularProgress, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import Logo from './assets/Logo';
import Layout from './Layout';

const useStyles = makeStyles(({ spacing, palette }) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    maxWidth: `calc(100% - ${spacing(4)}px)`,
    transform: 'translateX(-50%) translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(4),
  },
  logo: {
    color: palette.primary.main,
    fontSize: '5rem',
    marginBottom: spacing(4),
  },
}));

export default function Loading({ layout, layoutProps }) {
  return layout ? (
    <Layout {...layoutProps}>
      <Spinner />
    </Layout>
  ) : (
    <Spinner />
  );
}

function Spinner() {
  const classes = useStyles();

  return (
    <Paper className={classes.wrapper}>
      <Logo className={classes.logo} />
      <CircularProgress color="secondary" />
    </Paper>
  );
}
