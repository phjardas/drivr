import { CssBaseline } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
  },
});

if (process.env.NODE_ENV === 'development') {
  console.debug('Theme:', theme);
}

export function ThemeProvider({ children }) {
  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </>
  );
}
