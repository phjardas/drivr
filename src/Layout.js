import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CacheNotification from './CacheNotification';
import DarkModeButton from './DarkModeButton';
import UpdateNotification from './UpdateNotification';

const useStyles = makeStyles(({ spacing }) => ({
  gutter: {
    margin: `${spacing(2)}px 0`,
  },
  actions: {
    marginLeft: 'auto',
  },
}));

export default function Layout({ title, back, gutter, children }) {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>{title ? `${title} - drivr` : 'drivr'}</title>
      </Helmet>
      <AppBar position="sticky" color="secondary">
        <Toolbar>
          {back && (
            <IconButton edge="start" color="inherit" component={Link} to={back}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">{title || 'drivr'}</Typography>
          <div className={classes.actions}>
            <DarkModeButton />
          </div>
        </Toolbar>
      </AppBar>
      <main className={gutter && classes.gutter}>{children}</main>
      <CacheNotification />
      <UpdateNotification />
    </>
  );
}
