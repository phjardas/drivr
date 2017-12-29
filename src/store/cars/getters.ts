import { SyncedCollection, emptySyncedCollection } from '../firestore/model';
import { Car, Refuel } from './model';
import { CarsState } from './state';

export const getters = {
  cars(state: CarsState): SyncedCollection<Car> {
    return state.cars;
  },
  getCar(state: CarsState): (carId: string) => Car {
    return carId => state.cars.items[carId];
  },
  getCarRefuels(state: CarsState): (carId: string) => SyncedCollection<Refuel> {
    return carId => state.refuels[carId] || emptySyncedCollection();
  },
};
