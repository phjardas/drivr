import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useAnalytics } from '../analytics';
import { CarsProvider } from '../data/cars';
import Loading from '../Loading';
import Redirect from '../Redirect';

const Car = lazy(() => import('./cars/_id/Car'));
const Cars = lazy(() => import('./cars/Cars'));
const NewCar = lazy(() => import('./cars/NewCar'));

export default function Pages() {
  return (
    <CarsProvider>
      <Suspense fallback={<Loading layout={true} />}>
        <BrowserRouter>
          <Routes>
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/_new" element={<NewCar />} />
            <Route path="/cars/:id/*" element={<Car />} />
            <Route path="/" element={<Redirect to="/cars" />} />
          </Routes>
          <Routes>
            <Route path="*" element={<AnalyticsRoute />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </CarsProvider>
  );
}

function AnalyticsRoute() {
  const ga = useAnalytics();
  const location = useLocation();
  useEffect(() => {
    ga.pageview(location.pathname);
  }, [ga, location]);
  return null;
}
