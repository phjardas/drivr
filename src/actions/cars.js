import Names from './names';
import uuid from '../service/uuid';
import firebase from '../service/firebase';
import store from '../store';
import { registerFirebaseListeners } from './firedux';
import { deleteRefuels } from './refuels';

const db = firebase.database();
const cars = db.ref('cars');

registerFirebaseListeners(cars, Names.Car, store);

export function createCar(car) {
  return () => {
    const id = uuid();
    return cars.child(id)
      .set(car)
      .then(() => Object.assign({ id }, car));
  };
}

export function deleteCar(id) {
  return dispatch => Promise.all([
    cars.child(id).remove(),
    deleteRefuels(id)(dispatch),
  ]);
}
