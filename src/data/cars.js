import React, { createContext, useContext, useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuth } from '../auth';
import { Firebase, firestore } from '../firebase';
import { materialize } from './utils';

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

export async function createCarInvite(car) {
  const ref = await firestore
    .collection('cars')
    .doc(car.id)
    .collection('invites')
    .add({ createdAt: Firebase.firestore.FieldValue.serverTimestamp() });
  return { id: ref.id };
}

export async function unshareCar(carId, userId) {
  await firestore
    .collection('cars')
    .doc(carId)
    .update({ [`users.${userId}`]: Firebase.firestore.FieldValue.delete() });
}
