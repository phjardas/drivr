import { createMuiTheme, CssBaseline, makeStyles, ThemeProvider as MuiThemeProvider, useMediaQuery } from '@material-ui/core';
import { blue, lightBlue, deepPurple } from '@material-ui/core/colors';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

function ThemeWrapper({ children }) {
  const theme = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Wrapper>{children}</Wrapper>
    </MuiThemeProvider>
  );
}

const useStyles = makeStyles(({ palette }) => ({
  '@global': {
    body: {
      background: palette.background.default,
    },
  },
}));

function Wrapper({ children }) {
  useStyles();
  return children;
}

const localStorageKey = 'drivr:dark';
const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState((localStorage.getItem(localStorageKey) || JSON.stringify(prefersDarkMode)) === 'true');
  const updateDarkMode = useCallback(
    (active) => {
      setDarkMode(active);
      localStorage.setItem(localStorageKey, JSON.stringify(active));
    },
    [setDarkMode]
  );

  return <DarkModeContext.Provider value={{ darkMode, setDarkMode: updateDarkMode }}>{children}</DarkModeContext.Provider>;
}

function useTheme() {
  const { darkMode } = useDarkMode();

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary: darkMode ? lightBlue : blue,
          secondary: darkMode ? { main: deepPurple[700] } : deepPurple,
        },
      }),
    [darkMode]
  );

  if (process.env.NODE_ENV === 'development') {
    console.debug('Theme:', theme);
  }

  return theme;
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error('useDarkMode() used without a context');
  return context;
}

export function ThemeProvider({ children }) {
  return (
    <DarkModeProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </DarkModeProvider>
  );
}
