import * as functions from 'firebase-functions';
import { FirebaseFirestore } from '@firebase/firestore-types';

interface Statistics {
  createdAt: Date;
  userCount: number;
  carCount: number;
  refuelCount: number;
  totalDistance: number;
  totalFuel: number;
  totalMoney: number;
}

function emptyStatistics(): Statistics {
  return Object.freeze({
    createdAt: new Date(),
    userCount: 0,
    carCount: 0,
    refuelCount: 0,
    totalDistance: 0,
    totalFuel: 0,
    totalMoney: 0,
  });
}

type StatisticsMutator = (stats: Statistics) => Statistics;

async function updateStatistics(db: FirebaseFirestore, mutator: StatisticsMutator): Promise<any> {
  const statsRef = db.doc('statistics/global');

  return db.runTransaction(async tx => {
    const statsDoc = await tx.get(statsRef);
    const stats: Statistics = statsDoc.exists ? (statsDoc.data() as any) : emptyStatistics();
    const nextStats = mutator(stats);
    console.log('saving statistics:', nextStats);
    return tx.set(statsRef, nextStats);
  });
}

const carDoc = functions.firestore.document('cars/{carId}');

export const car_onCreate = carDoc.onCreate(event => {
  console.log('updating statistics for new car');
  return updateStatistics(event.data.ref.firestore, stats => ({
    ...stats,
    carCount: stats.carCount + 1,
  }));
});

export const car_onDelete = carDoc.onDelete(event => {
  console.log('updating statistics for deleted car');
  return updateStatistics(event.data.ref.firestore, stats => ({
    ...stats,
    carCount: stats.carCount - 1,
  }));
});

const refuelDoc = functions.firestore.document('refuels/{refuelId}');

export const refuel_onCreate = refuelDoc.onCreate(event => {
  const refuel = event.data.data();
  console.log('updating statistics for new refuel');
  return updateStatistics(event.data.ref.firestore, stats => ({
    ...stats,
    refuelCount: stats.refuelCount + 1,
    totalFuel: stats.totalFuel + refuel.fuelAmount,
    totalMoney: stats.totalMoney + refuel.totalPrice,
    totalDistance: stats.totalDistance + (refuel.distance || 0),
  }));
});

export const refuel_onDelete = refuelDoc.onDelete(event => {
  const refuel = event.data.previous.data();
  console.log('updating statistics for deleted refuel');
  return updateStatistics(event.data.ref.firestore, stats => ({
    ...stats,
    refuelCount: stats.refuelCount - 1,
    totalFuel: stats.totalFuel - refuel.fuelAmount,
    totalMoney: stats.totalMoney - refuel.totalPrice,
    totalDistance: stats.totalDistance - (refuel.distance || 0),
  }));
});
