import { Fab as MaterialFab, makeStyles, useTheme, Zoom } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  fab: {
    position: 'fixed',
    bottom: spacing(2),
    right: spacing(2),
  },
}));

export default function Fab(props) {
  const classes = useStyles();
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Zoom in={true} timeout={transitionDuration} unmountOnExit>
      <MaterialFab color="secondary" className={classes.fab} {...props} />
    </Zoom>
  );
}
