import { SyncedCollection, emptySyncedCollection } from '../firestore/model';
import { Car, Refuel } from './model';

export interface CarsState {
  cars: SyncedCollection<Car>;
  refuels: { [carId: string]: SyncedCollection<Refuel> };
}

export const state: CarsState = {
  cars: emptySyncedCollection(),
  refuels: {},
};
