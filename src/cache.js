import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { register as registerServiceWorker } from './serviceWorker';

const Context = createContext({ cached: false, updated: false });

export function CacheProvider({ children }) {
  const [state, setState] = useState({ cached: false, updated: false });
  const setCached = useCallback(() => setState((s) => ({ ...s, cached: true })), [setState]);
  const setUpdated = useCallback(() => setState((s) => ({ ...s, updated: true })), [setState]);

  useEffect(() => {
    registerServiceWorker({ onSuccess: setCached, onUpdate: setUpdated });
    if (process.env.NODE_ENV !== 'production') {
      window._setCached = setCached;
      window._setUpdated = setUpdated;
    }
  }, [setCached, setUpdated]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export function useCache() {
  return useContext(Context);
}
