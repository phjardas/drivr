import Names from './names';
import uuid from '../service/uuid';
import firebase from '../service/firebase';
import store from '../store';
import { registerFirebaseListeners } from './firedux';

const db = firebase.database();
const cars = db.ref('cars');

registerFirebaseListeners(cars, Names.Car, store);

export function createCar(car) {
  return () => {
    const id = uuid();
    return cars.child(id).set({
      licensePlate: car.licensePlate,
    }).then(() => ({
      id: id,
      car,
    }));
  };
}

export function deleteCar(id) {
  return () => cars.child(id).remove();
}
