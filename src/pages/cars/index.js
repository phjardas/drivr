import React, { lazy } from 'react';
import { Routes } from 'react-router-dom';
import { CarsProvider } from '../../data/cars';
import ProtectedRoute from '../../ProtectedRoute';

const Car = lazy(() => import('./_id/Car'));
const CarsList = lazy(() => import('./Cars'));
const NewCar = lazy(() => import('./NewCar'));

export default function Cars() {
  return (
    <CarsProvider>
      <Routes>
        <ProtectedRoute path="/" element={<CarsList />} />
        <ProtectedRoute path="/_new" element={<NewCar />} />
        <ProtectedRoute path="/:id/*" element={<Car />} />
      </Routes>
    </CarsProvider>
  );
}
