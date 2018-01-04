import { ActionTree, ActionContext } from 'vuex';
import { firestore, firestoreModule } from '../../../firebase/firestore';
import { FirebaseFirestore, DocumentReference, CollectionReference } from '@firebase/firestore-types';

import { CarsState } from '../state';
import { Car, CarStatistics, CarData, Refuel } from '../model';
import { syncFirestoreCollection, Unsubscribe } from '../../firestore';

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

async function loadRefuels(carId: string): Promise<Refuel[]> {
  const snapshot = await firestore
    .collection('refuels')
    .where('carId', '==', carId)
    .orderBy('date', 'asc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Refuel));
}

export const actions: ActionTree<CarsState, any> = {
  async loadCars(context: ActionContext<CarsState, any>): Promise<Unsubscribe> {
    const userId: string = context.rootGetters.userId;
    return syncFirestoreCollection(context, {
      ref: firestore.collection(`cars`).where(`users.${userId}`, '==', true),
      mutationPrefix: 'loadCars',
      transform(car: any) {
        return { ...car, owned: car.ownerId === userId };
      },
    });
  },

  async createCar({ rootGetters }, car: CarData): Promise<Car> {
    const userId: string = rootGetters.userId;
    const ref = await firestore.collection('cars').add({ ...car, ownerId: userId, users: { [userId]: true } });
    const doc = await ref.get();
    return { ...doc.data(), id: doc.id } as Car;
  },

  async refreshCarStatistics({ rootGetters }, payload: { carId: string }): Promise<CarStatistics | null> {
    const refuels = await loadRefuels(payload.carId);
    const stats = calculateStats(refuels);
    await firestore.doc(`cars/${payload.carId}`).update({ stats });
    return stats;
  },

  async deleteCar({ dispatch }, payload: { carId: string }): Promise<any> {
    await dispatch('deleteRefuels', { carId: payload.carId });
    await firestore.doc(`cars/${payload.carId}`).delete();
  },
};
