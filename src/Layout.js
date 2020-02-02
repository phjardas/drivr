import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Layout({ title, back, children }) {
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
      <main>{children}</main>
    </>
  );
}
