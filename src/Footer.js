import { Container, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const hash = process.env.REACT_APP_GIT_SHA || 'dev';

const useStyles = makeStyles(({ palette, spacing }) => ({
  footer: {
    marginTop: spacing(2),
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    color: palette.text.secondary,
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Container component="footer" className={classes.footer}>
      <Typography variant="body2">drivr {hash}</Typography>
    </Container>
  );
}
