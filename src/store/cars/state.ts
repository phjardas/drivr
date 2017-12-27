import { SyncedCollection } from '../firestore/model';
import { Car } from './model';

export type CarsState = SyncedCollection<Car>;

export const state: CarsState = {
  loading: false,
  loaded: false,
  failed: false,
  error: null,
  items: {},
};
