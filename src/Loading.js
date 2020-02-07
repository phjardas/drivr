import { CircularProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import Logo from './assets/Logo';
import Delay from './Delay';
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
    padding: spacing(6),
  },
  logo: {
    fontSize: '5rem',
  },
  spinner: {
    marginTop: spacing(6),
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
    <Delay wait={300}>
      <Paper className={classes.wrapper}>
        <Logo className={classes.logo} />
        <Typography variant="h4" tag="h1">
          drivr
        </Typography>
        <CircularProgress color="primary" className={classes.spinner} />
      </Paper>
    </Delay>
  );
}
