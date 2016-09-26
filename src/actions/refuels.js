import Names from './names';
import uuid from '../service/uuid';
import firebase from '../service/firebase';
import store from '../store';
import { registerFirebaseListeners } from './firedux';

const db = firebase.database();
const refuels = db.ref('refuels');

const subscribedCars = {};

export function loadRefuels(carId) {
  return () => {
    if (!(carId in subscribedCars)) {
      subscribedCars[carId] = true;
      registerFirebaseListeners(refuels.child(carId), Names.Refuel, store);
    }
  };
}

export function createRefuel(refuel) {
  return () => {
    const id = uuid();
    return refuels.child(refuel.carId).child(id).set(refuel).then(() => ({
      id: id,
      refuel,
    }));
  };
}
