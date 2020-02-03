import React, { lazy } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Route, Routes, useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import Loading from '../Loading';

const CarDetails = lazy(() => import('./CarDetails'));
const NewRefuel = lazy(() => import('./NewRefuel'));

export default function Car() {
  const { id } = useParams();
  const [doc, loading, error] = useDocument(firestore.collection('cars').doc(id), { snapshotListenOptions: { includeMetadataChanges: true } });

  if (loading) return <Loading layout={true} />;
  if (error) return <div>Error: {error.message}</div>;

  const car = { ...doc.data(), id: doc.id };
  const cached = doc.metadata.fromCache;

  return (
    <Routes>
      <Route path="refuels/_new" element={<NewRefuel car={car} cached={cached} />} />
      <Route path="/" element={<CarDetails car={car} cached={cached} />} />
    </Routes>
  );
}
