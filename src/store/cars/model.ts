export interface RefuelData {
  carId: string;
  userId: string;
  date: Date;
  mileage: number;
  fuelAmount: number;
  totalPrice: number;
  pricePerLiter: number;
  distance?: number;
  consumption?: number;
}

export interface Refuel extends RefuelData {
  id: string;
  createdAt: Date;
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

export interface CarShare {
  inviteId: string;
  inviteeId: string;
  ownerId: string;
  carId: string;
  sharedAt: Date;
  acceptedAt: Date;
}

export interface CarData {
  label: string;
  lastRefuel?: Refuel;
  stats?: CarStatistics;
}

export interface Car extends CarData {
  id: string;
  ownerId: string;
  users: { [userId: string]: boolean };
}
