import decimal from 'decimal.js';

import Names from './names';
import uuid from '../service/uuid';
import firebase from '../service/firebase';
import store from '../store';
import { registerFirebaseListeners } from './firedux';
import { Refuel } from '../model/refuel';

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

function calculateStats(car, refuel) {
  const oldStats = car.stats || {};
  const stats = {
    refuelCount: (oldStats.refuelCount || 0) + 1,
    totalDistance: refuel.mileage - (car.initialMileage || 0),
    totalFuel: decimal(oldStats.totalFuel || 0).add(refuel.fuelAmount),
    totalPrice: decimal(oldStats.totalPrice || 0).add(refuel.totalPrice),
  };

  if (stats.totalDistance && stats.totalFuel) {
    stats.averageConsumption = stats.totalFuel.div(stats.totalDistance).toString();
  }

  if (stats.totalDistance && stats.totalPrice) {
    stats.averagePricePerDistance = stats.totalPrice.div(stats.totalDistance).toString();
  }

  if (stats.totalPrice && stats.totalFuel) {
    stats.averagePricePerVolume = stats.totalPrice.div(stats.totalFuel).toString();
  }

  if (stats.totalFuel) stats.totalFuel = stats.totalFuel.toString();
  if (stats.totalPrice) stats.totalPrice = stats.totalPrice.toString();

  return stats;
}

export function createRefuel(refuel) {
  return (dispatch, getState) => {
    const id = uuid();
    const car = getState().cars[refuel.carId];
    const ref = new Refuel(refuel, car).toJS();
    const stats = calculateStats(car, ref);

    const updates = {
      [`/refuels/${car.id}/${id}`]: ref,
      [`/cars/${car.id}/lastRefuel`]: ref,
      [`/cars/${car.id}/stats`]: stats,
    };

    return db.ref().update(updates).then(() => ref);
  };
}
