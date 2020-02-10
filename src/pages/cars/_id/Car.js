import React, { lazy } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { useCar } from '../../../data';
import Loading from '../../../Loading';

const CarDetails = lazy(() => import('./CarDetails'));
const NewRefuel = lazy(() => import('./NewRefuel'));

export default function Car() {
  const { id } = useParams();
  const [car, loading, error] = useCar(id);
  if (loading) return <Loading layout={true} />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Routes>
      <Route path="refuels/_new" element={<NewRefuel car={car} />} />
      <Route path="*" element={<CarDetails car={car} />} />
    </Routes>
  );
}
