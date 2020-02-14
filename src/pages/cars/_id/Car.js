import React, { lazy } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { useCar } from '../../../data';
import DataSuspense from '../../../DataSuspense';

const CarDetails = lazy(() => import('./CarDetails'));
const NewRefuel = lazy(() => import('./NewRefuel'));

export default function Car() {
  const { id } = useParams();
  const [data, loading, error] = useCar(id);

  return (
    <DataSuspense loading={loading} error={error} data={data}>
      {(car) => (
        <Routes>
          <Route path="refuels/_new" element={<NewRefuel car={car} />} />
          <Route path="*" element={<CarDetails car={car} />} />
        </Routes>
      )}
    </DataSuspense>
  );
}
