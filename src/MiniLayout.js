import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import Logo from './assets/Logo';

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
  },
  main: {
    marginTop: spacing(4),
  },
}));

export default function MiniLayout({ children }) {
  const classes = useStyles();

  return (
    <Paper className={classes.wrapper}>
      <Logo className={classes.logo} />
      <Typography variant="h4" tag="h1">
        drivr
      </Typography>
      <div className={classes.main}>{children}</div>
    </Paper>
  );
}
