import { Fab as MaterialFab, makeStyles, useTheme, Zoom } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ spacing, zIndex }) => ({
  fab: {
    position: 'fixed',
    bottom: spacing(3),
    right: spacing(3),
    zIndex: zIndex.speedDial,
  },
}));

export default function Fab({ className, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Zoom in={true} timeout={transitionDuration} unmountOnExit>
      <MaterialFab color="primary" className={`${classes.fab} ${className || ''}`} {...props} />
    </Zoom>
  );
}
