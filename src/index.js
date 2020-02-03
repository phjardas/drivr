import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { register as registerServiceWorker } from './serviceWorker';
import { ThemeProvider } from './theme';

ReactDOM.render(
  <ThemeProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();
