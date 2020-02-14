import React, { createContext, useContext, useMemo } from 'react';
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

export function useRefuels(carId, order) {
  const collection = useMemo(() => {
    let coll = firestore
      .collection('cars')
      .doc(carId)
      .collection('refuels');
    if (order) coll = coll.orderBy(...order);
    return coll;
  }, [carId, order]);

  const [docs, loading, error] = useCollection(collection, { snapshotListenOptions: { includeMetadataChanges: true } });
  const refuels = docs && docs.docs.map(materialize);
  return [refuels, loading, error];
}

export function useDeleteRefuel(carId) {
  const coll = firestore
    .collection('cars')
    .doc(carId)
    .collection('refuels');

  return (refuelId) => coll.doc(refuelId).delete();
}

function materialize(doc) {
  return doc && { ...doc.data(), id: doc.id, _cached: doc.metadata.fromCache };
}
