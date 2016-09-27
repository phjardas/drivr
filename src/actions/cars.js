import Names from './names';
import uuid from '../service/uuid';
import firebase from '../service/firebase';
import store from '../store';
import { registerFirebaseListeners } from './firedux';
import { on as addAuthListener } from './auth';

const db = firebase.database();
let userId = null;
let unsubscribe = null;

addAuthListener('signin', user => {
  if (unsubscribe) unsubscribe();
  userId = user.id;
  const cars = db.ref('cars').child(userId);
  unsubscribe = registerFirebaseListeners(cars, Names.Car, store).unsubscribe;
});

addAuthListener('signout', () => {
  if (unsubscribe) unsubscribe();
  userId = null;
});

export function getCarPath(carId) {
  if (!userId) throw new Error('Unauthenticated!');
  return `/cars/${userId}/${carId}`;
}

export function createCar(car) {
  return () => {
    const id = uuid();
    return db.ref(getCarPath(id))
      .set(car)
      .then(() => Object.assign({ id, userId }, car));
  };
}
