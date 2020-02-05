import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { CacheProvider } from './cache';
import { ThemeProvider } from './theme';

ReactDOM.render(
  <CacheProvider>
    <ThemeProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ThemeProvider>
  </CacheProvider>,
  document.getElementById('root')
);
