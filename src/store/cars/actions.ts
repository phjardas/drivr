import { ActionTree } from 'vuex';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseFirestore, DocumentReference, CollectionReference } from '@firebase/firestore-types';

import { CarsState, Car, Refuel, CarStatistics, CarData, RefuelData } from './state';

function calculateStats(refuels: Refuel[]): CarStatistics | null {
  if (refuels.length < 2) return null;

  const firstRefuel = refuels[0];
  const lastRefuel = refuels[refuels.length - 1];

  const stats: CarStatistics = {
    refuelCount: refuels.length,
    totalDistance: lastRefuel.mileage - firstRefuel.mileage,
    totalFuel: refuels.map(r => r.fuelAmount).reduce((a, b) => a + b, 0),
    totalPrice: refuels.map(r => r.totalPrice).reduce((a, b) => a + b, 0),
  };

  if (stats.totalDistance && firstRefuel) {
    stats.averageConsumption = (stats.totalFuel - firstRefuel.fuelAmount) / stats.totalDistance;
  }

  if (stats.totalDistance && firstRefuel) {
    stats.averagePricePerDistance = (stats.totalPrice - firstRefuel.totalPrice) / stats.totalDistance;
  }

  if (stats.totalPrice && stats.totalFuel) {
    stats.averagePricePerVolume = stats.totalPrice / stats.totalFuel;
  }

  return stats;
}

async function loadRefuels(carRef: DocumentReference): Promise<Refuel[]> {
  const snapshot = await carRef.collection('refuels').get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as any))
    .map(
      refuel =>
        ({
          ...refuel,
          date: new Date(refuel.date),
          mileage: parseFloat(refuel.mileage),
          fuelAmount: parseFloat(refuel.fuelAmount),
          totalPrice: parseFloat(refuel.totalPrice),
          pricePerLiter: parseFloat(refuel.pricePerLiter),
          consumption: parseFloat(refuel.consumption),
        } as Refuel)
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function firestore(): FirebaseFirestore {
  if (!firebase.firestore) throw new Error('Firestore not available');
  return firebase.firestore();
}

export const actions: ActionTree<CarsState, any> = {
  async createCar({ rootGetters }, car: CarData): Promise<Car> {
    const userId: string = rootGetters.userId;
    return firestore()
      .collection(`users/${userId}/cars`)
      .add(car)
      .then(doc => ({ ...car, id: doc.id }));
  },

  async createRefuel({ state, dispatch, rootGetters }, payload: RefuelData & { carId: string }): Promise<Refuel> {
    const { userId } = rootGetters;
    const { carId, date, mileage, fuelAmount, totalPrice } = payload;
    const car = state.items[carId];
    const db = firestore();
    const carRef = db.doc(`users/${userId}/cars/${carId}`);

    // FIXME actually we only need the latest refuel here
    const refuels = await loadRefuels(carRef);

    const refuel: RefuelData = { date, mileage, fuelAmount, totalPrice };

    if (refuels.length) {
      const lastMileage = refuels[refuels.length - 1].mileage;
      const distance = mileage - lastMileage;
      refuel.distance = distance;
      refuel.consumption = fuelAmount / distance;
      refuel.pricePerLiter = totalPrice / fuelAmount;
    }

    const refuelDoc = await db.runTransaction(tx =>
      carRef
        .collection('refuels')
        .add(refuel)
        .then(refuelRef => {
          const refuelDoc = { ...refuel, id: refuelRef.id };
          return carRef.update({ lastRefuel: refuelDoc }).then(() => refuelDoc as Refuel);
        })
    );

    await dispatch('refreshCarStatistics', { carId });

    return refuelDoc;
  },

  async refreshCarStatistics({ rootGetters }, payload: { carId: string }): Promise<CarStatistics | null> {
    const { userId } = rootGetters;
    const db = firestore();
    const carRef = db.doc(`users/${userId}/cars/${payload.carId}`);
    const refuels = await loadRefuels(carRef);
    const stats = calculateStats(refuels);
    await carRef.update({ stats });
    return stats;
  },
};
