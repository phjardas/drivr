import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(({ spacing }) => ({
  main: {
    margin: `${spacing(2)}px 0`,
  },
}));

export default function Layout({ title, back, children }) {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>{title ? `${title} - drivr` : 'drivr'}</title>
      </Helmet>
      <AppBar position="sticky">
        <Toolbar>
          {back && (
            <IconButton edge="start" color="inherit" component={Link} to={back}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">{title || 'drivr'}</Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>{children}</main>
    </>
  );
}
