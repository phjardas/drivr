import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { CarsProvider } from '../data/cars';
import Loading from '../Loading';

const Car = lazy(() => import('./Car'));
const Cars = lazy(() => import('./Cars'));
const NewCar = lazy(() => import('./NewCar'));

export default function Pages() {
  return (
    <CarsProvider>
      <Suspense fallback={<Loading layout={true} />}>
        <BrowserRouter>
          <Routes>
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/_new" element={<NewCar />} />
            <Route path="/cars/:id/*" element={<Car />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </CarsProvider>
  );
}

function Home() {
  const navigate = useNavigate();
  useEffect(() => navigate('/cars'), [navigate]);
  return null;
}
