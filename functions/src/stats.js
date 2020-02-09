import Firebase from 'firebase-admin';

export function updateCarStatistics(refuels, carId) {
  if (!refuels.length) {
    return [
      {
        path: `cars/${carId}`,
        operation: 'update',
        value: {
          stats: { refuelCount: 0 },
          lastRefuel: deleteField(),
        },
      },
    ];
  }

  const updates = [];
  let refuelCount = 0;
  let totalDistance = 0;
  let totalFuel = 0;
  let totalPrice = 0;
  let previousRefuel;

  for (const refuel of refuels) {
    const refuelData = {
      pricePerLiter: refuel.totalPrice / refuel.fuelAmount,
      consumption: deleteField(),
      distance: deleteField(),
    };

    if (previousRefuel) {
      const distance = refuel.mileage - previousRefuel.mileage;
      refuelData.distance = distance;
      totalDistance += distance;
      if (!refuel.incomplete) refuelData.consumption = refuel.fuelAmount / distance;
    }

    refuelCount++;
    totalFuel += refuel.fuelAmount;
    totalPrice += refuel.totalPrice;
    previousRefuel = { ...refuel, ...refuelData };

    updates.push({
      path: `cars/${carId}/refuels/${refuel.id}`,
      operation: 'update',
      value: refuelData,
    });
  }

  const firstRefuel = refuels[0];
  const stats = {
    refuelCount,
    totalDistance,
    totalFuel,
    totalPrice,
    averageConsumption: deleteField(),
    averagePricePerDistance: deleteField(),
    averagePricePerVolume: deleteField(),
  };

  if (stats.totalDistance && refuelCount > 1) {
    stats.averageConsumption = (stats.totalFuel - firstRefuel.fuelAmount) / stats.totalDistance;
    stats.averagePricePerDistance = (stats.totalPrice - firstRefuel.totalPrice) / stats.totalDistance;
  }

  if (stats.totalFuel) {
    stats.averagePricePerVolume = stats.totalPrice / stats.totalFuel;
  }

  updates.push({
    path: `cars/${carId}`,
    operation: 'update',
    value: {
      stats,
      lastRefuel: previousRefuel,
    },
  });

  return updates;
}

export function deleteField() {
  return Firebase.firestore.FieldValue.delete();
}
