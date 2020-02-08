import React, { createContext, useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuth } from '../auth';
import { firestore } from '../firebase';

const Context = createContext();

export function CarsProvider({ children }) {
  const { user } = useAuth();
  const [docs, loading, error] = useCollection(firestore.collection('cars').where(`users.${user.id}`, '==', true), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const cars = docs && docs.docs.map(materialize);
  return <Context.Provider value={[cars, loading, error]}>{children}</Context.Provider>;
}

export function useCars() {
  return useContext(Context);
}

export function useCar(id) {
  const [cars, loading, error] = useCars();
  if (loading || error) return [null, loading, error];

  const car = cars.find((c) => c.id === id);
  return [car, false];
}

export function useRefuels(carId) {
  const [docs, loading, error] = useCollection(
    firestore
      .collection('cars')
      .doc(carId)
      .collection('refuels')
      .orderBy('date', 'desc'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const refuels = docs && docs.docs.map(materialize);
  return [refuels, loading, error];
}

function materialize(doc) {
  return doc && { ...doc.data(), id: doc.id, _cached: doc.metadata.fromCache };
}
