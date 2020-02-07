import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './auth';
import { CacheProvider } from './cache';
import Pages from './pages';
import { ThemeProvider } from './theme';

export default function App() {
  return (
    <CacheProvider>
      <ThemeProvider>
        <HelmetProvider>
          <AuthProvider>
            <Pages />
          </AuthProvider>
        </HelmetProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
