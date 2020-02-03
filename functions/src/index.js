import functions from 'firebase-functions';

function emptyStatistics() {
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

async function updateGlobalStatistics(db, mutator) {
  const statsRef = db.doc('statistics/global');

  return db.runTransaction(async (tx) => {
    const statsDoc = await tx.get(statsRef);
    const stats = statsDoc.exists ? statsDoc.data() : emptyStatistics();
    const nextStats = mutator(stats);
    console.log('saving global statistics:', nextStats);
    return tx.set(statsRef, nextStats);
  });
}

function calculateCarStats(refuels) {
  if (refuels.length < 2) return null;

  const firstRefuel = refuels[0];
  const lastRefuel = refuels[refuels.length - 1];

  const stats = {
    refuelCount: refuels.length,
    totalDistance: lastRefuel.mileage - firstRefuel.mileage,
    totalFuel: refuels.map((r) => r.fuelAmount).reduce((a, b) => a + b, 0),
    totalPrice: refuels.map((r) => r.totalPrice).reduce((a, b) => a + b, 0),
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

async function updateCarStatistics(db, carId) {
  console.log('updating statistics for car %s', carId);
  const refuelsSnapshot = await db
    .collection('refuels')
    .where('carId', '==', carId)
    .orderBy('date', 'asc')
    .get();
  const refuels = refuelsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const stats = calculateCarStats(refuels);
  console.log('updated statistics for car %s:', carId, stats);
  return db.doc(`cars/${carId}`).update({ stats });
}

const carDoc = functions.firestore.document('cars/{carId}');

export const car_onCreate = carDoc.onCreate((event) => {
  console.log('updating statistics for new car');
  return updateGlobalStatistics(event.data.ref.firestore, (stats) => ({
    ...stats,
    carCount: stats.carCount + 1,
  }));
});

export const car_onDelete = carDoc.onDelete((event) => {
  console.log('updating statistics for deleted car');
  return updateGlobalStatistics(event.data.ref.firestore, (stats) => ({
    ...stats,
    carCount: stats.carCount - 1,
  }));
});

const refuelDoc = functions.firestore.document('refuels/{refuelId}');

export const refuel_onCreate = refuelDoc.onCreate((event) => {
  const refuel = event.data.data();
  console.log('updating statistics for new refuel');
  return Promise.all([
    updateCarStatistics(event.data.ref.firestore, refuel.carId),
    updateGlobalStatistics(event.data.ref.firestore, (stats) => ({
      ...stats,
      refuelCount: stats.refuelCount + 1,
      totalFuel: stats.totalFuel + refuel.fuelAmount,
      totalMoney: stats.totalMoney + refuel.totalPrice,
      totalDistance: stats.totalDistance + (refuel.distance || 0),
    })),
  ]);
});

export const refuel_onDelete = refuelDoc.onDelete((event) => {
  const refuel = event.data.previous.data();
  console.log('updating statistics for deleted refuel');
  return Promise.all([
    updateCarStatistics(event.data.ref.firestore, refuel.carId),
    updateGlobalStatistics(event.data.ref.firestore, (stats) => ({
      ...stats,
      refuelCount: stats.refuelCount - 1,
      totalFuel: stats.totalFuel - refuel.fuelAmount,
      totalMoney: stats.totalMoney - refuel.totalPrice,
      totalDistance: stats.totalDistance - (refuel.distance || 0),
    })),
  ]);
});
