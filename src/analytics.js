import React, { createContext, useContext } from 'react';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-3900768-22');

const AnalyticsContext = createContext();

export function AnalyticsProvider({ children }) {
  return <AnalyticsContext.Provider value={ReactGA}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
