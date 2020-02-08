import admin from './firebase';

function calculateCarStatistics(refuels) {
  const lastRefuel = refuels.length > 0 && refuels[refuels.length - 1];
  if (refuels.length < 2) return { lastRefuel };

  const firstRefuel = refuels[0];

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

  return { stats, lastRefuel };
}

export async function updateCarStatistics(carId) {
  const carDoc = admin
    .firestore()
    .collection('cars')
    .doc(carId);
  const refuelsSnapshot = await carDoc
    .collection('refuels')
    .orderBy('date', 'asc')
    .get();
  const refuels = refuelsSnapshot.docs.map((doc) => doc.data());
  const { stats, lastRefuel } = calculateCarStatistics(refuels);
  await carDoc.update({ stats, lastRefuel });
}
