import * as firebase from 'firebase';

function calculateStats({ refuels, refuel }) {
  refuels.push(refuel);
  const firstRefuel = refuels[0];
  const stats = {
    refuelCount: refuels.length,
    totalDistance: refuel.mileage - firstRefuel.mileage,
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

async function loadRefuels(carRef) {
  const snapshot = await carRef.collection('refuels').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.date.localeCompare(b.date));
}

export default {
  async createRefuel({ state, rootGetters }, { carId, date, mileage, fuelAmount, totalPrice }) {
    const { userId } = rootGetters;
    const car = state.items[carId];
    const db = firebase.firestore();
    const carRef = db.doc(`users/${userId}/cars/${carId}`);
    const refuels = await loadRefuels(carRef);

    const refuel = {
      date,
      mileage,
      fuelAmount,
      totalPrice,
    };

    if (refuels.length) {
      const lastMileage = refuels[refuels.length - 1].mileage;
      const distance = lastMileage ? mileage - lastMileage : null;
      refuel.distance = distance;
      refuel.consumption = fuelAmount / distance;
      refuel.pricePerLiter = totalPrice / fuelAmount;
    }

    const stats = calculateStats({ refuels, refuel });

    return db.runTransaction(tx =>
      carRef
        .collection('refuels')
        .add(refuel)
        .then(refuelRef => {
          return carRef.update({
            lastRefuel: { ...refuel, id: refuelRef.id },
            stats: stats,
          });
        })
    );
  },
};
