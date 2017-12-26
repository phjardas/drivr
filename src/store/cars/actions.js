import * as firebase from 'firebase';

function calculateStats({ refuels }) {
  if (refuels.length < 2) return null;

  const firstRefuel = refuels[0];
  const lastRefuel = refuels[refuels.length - 1];

  const stats = {
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

async function loadRefuels(carRef) {
  const snapshot = await carRef.collection('refuels').get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .map(refuel => ({
      ...refuel,
      date: new Date(refuel.date),
      mileage: parseFloat(refuel.mileage),
      fuelAmount: parseFloat(refuel.fuelAmount),
      totalPrice: parseFloat(refuel.totalPrice),
      pricePerLiter: parseFloat(refuel.pricePerLiter),
      consumption: parseFloat(refuel.consumption),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default {
  async createCar({ rootGetters }, car) {
    const db = firebase.firestore();
    const { userId } = rootGetters;
    return db
      .collection(`users/${userId}/cars`)
      .add(car)
      .then(doc => ({ ...car, id: doc.id }));
  },

  async createRefuel({ state, dispatch, rootGetters }, { carId, date, mileage, fuelAmount, totalPrice }) {
    const { userId } = rootGetters;
    const car = state.items[carId];
    const db = firebase.firestore();
    const carRef = db.doc(`users/${userId}/cars/${carId}`);

    // FIXME actually we only need the latest refuel here
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

    const refuelDoc = await db.runTransaction(tx =>
      carRef
        .collection('refuels')
        .add(refuel)
        .then(refuelRef => {
          const refuelDoc = { ...refuel, id: refuelRef.id };
          return carRef.update({ lastRefuel: refuelDoc }).then(() => refuelDoc);
        })
    );

    await dispatch('refreshCarStatistics', { carId });

    return refuelDoc;
  },

  async refreshCarStatistics({ rootGetters }, { carId }) {
    const { userId } = rootGetters;
    const db = firebase.firestore();
    const carRef = db.doc(`users/${userId}/cars/${carId}`);
    const refuels = await loadRefuels(carRef);
    const stats = calculateStats({ refuels });
    await carRef.update({ stats });
    return stats;
  },
};
