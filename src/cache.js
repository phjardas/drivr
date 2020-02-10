import React, { createContext, useContext, useEffect, useState } from 'react';
import { register as registerServiceWorker } from './serviceWorker';

const Context = createContext({ cached: false, updated: false });

export function CacheProvider({ children }) {
  const [state, setState] = useState({ cached: false, updated: false });

  useEffect(() => {
    registerServiceWorker({
      onSuccess: () => setState((s) => ({ ...s, cached: true })),
      onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
          waitingServiceWorker.addEventListener('statechange', (event) => {
            if (event.target.state === 'activated') {
              setState((s) => ({ ...s, updated: true }));
            }
          });
          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      },
    });
  }, [setState]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export function useCache() {
  return useContext(Context);
}
