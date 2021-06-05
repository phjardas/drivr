import React, { createContext, useContext, useMemo } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useAuth } from '../auth';
import { apiUrl } from '../config';
import { Firebase, firestore } from '../firebase';
import { materialize } from './utils';

const Context = createContext();
const carsColl = firestore.collection('cars');

export function CarsProvider({ children }) {
  const { user } = useAuth();
  const [docs, loading, error] = useCollection(carsColl.where(`users.${user.id}`, '==', true), {
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

export async function createCar(data, userId) {
  const { id } = await carsColl.add({ ...data, ownerId: userId, users: { [userId]: true } });
  return id;
}

export function useRefuels(carId, order) {
  const collection = useMemo(() => {
    let coll = firestore.collection('cars').doc(carId).collection('refuels');
    if (order) coll = coll.orderBy(...order);
    return coll;
  }, [carId, order]);

  const [docs, loading, error] = useCollection(collection, { snapshotListenOptions: { includeMetadataChanges: true } });
  const refuels = docs && docs.docs.map(materialize);
  return [refuels, loading, error];
}

export function useDeleteRefuel(carId) {
  const coll = firestore.collection('cars').doc(carId).collection('refuels');

  return (refuelId) => coll.doc(refuelId).delete();
}

export async function createCarInvite(car, owner) {
  const ref = await firestore.collection('cars').doc(car.id).collection('invites').add({
    carLabel: car.label,
    ownerId: owner.id,
    ownerLabel: owner.label,
    createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
}

export function useCarInvite(carId, inviteId) {
  const [data, loading, error] = useDocument(firestore.collection('cars').doc(carId).collection('invites').doc(inviteId));

  if (loading || error) return [null, loading, error];
  return [materialize(data), false];
}

export function useAcceptCarInvitation() {
  const { token } = useAuth();

  return async (carId, inviteId) => {
    const response = await fetch(`${apiUrl}/acceptInvitation`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${await token}`,
        'content-type': 'application/json;charset=utf-8',
        accept: 'application/json',
      },
      body: JSON.stringify({ carId, inviteId }),
    });

    if (!response.ok) throw new Error(`Error ${response.status} ${response.statusText}`);
  };
}

export async function unshareCar(carId, userId) {
  await firestore
    .collection('cars')
    .doc(carId)
    .update({ [`users.${userId}`]: Firebase.firestore.FieldValue.deleteField() });
}
