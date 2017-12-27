import { SyncedCollection } from '../firestore/model';

export interface RefuelData {
  date: Date;
  mileage: number;
  fuelAmount: number;
  totalPrice: number;
  distance?: number;
  consumption?: number;
  pricePerLiter?: number;
}

export interface Refuel extends RefuelData {
  id: string;
}

export interface CarStatistics {
  refuelCount: number;
  totalDistance: number;
  totalFuel: number;
  totalPrice: number;
  averageConsumption?: number;
  averagePricePerDistance?: number;
  averagePricePerVolume?: number;
}

export interface CarData {
  licensePlate: string;
  lastRefuel?: Refuel;
  stats?: CarStatistics;
}

export interface Car extends CarData {
  id: string;
}
