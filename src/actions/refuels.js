import Names from './names';
import uuid from '../service/uuid';
import firebase from '../service/firebase';
import store from '../store';
import { registerFirebaseListeners, unregisterFirebaseListeners } from './firedux';
import { Refuel } from '../model/refuel';

const db = firebase.database();
const refuels = db.ref('refuels');
const cars = db.ref('cars');

const subscribedCars = {};

export function loadRefuels(carId) {
  return () => {
    if (!(carId in subscribedCars)) {
      subscribedCars[carId] = true;
      registerFirebaseListeners(refuels.child(carId), Names.Refuel, store);
    }
  };
}

function unloadRefuels(carId) {
  if (carId in subscribedCars) {
    delete subscribedCars[carId];
    unregisterFirebaseListeners(refuels.child(carId));
  }
}

export function createRefuel(refuel) {
  return (dispatch, getState) => {
    const id = uuid();
    const car = getState().cars[refuel.carId];
    const ref = new Refuel(refuel, car).toJS();

    return refuels.child(car.id).child(id).set(ref)
      .then(() => cars.child(car.id).child('lastRefuel').set(Object.assign({id}, ref)))
      .then(() => ref);
  };
}

export function deleteRefuels(carId) {
  return () => {
    unloadRefuels(carId);
    refuels.child(carId).remove()
  }
}
