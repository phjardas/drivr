import Firebase from 'firebase-admin';

export function updateCarStatistics(refuels, carId) {
  const updates = [];
  let refuelCount = 0;
  let totalDistance = 0;
  let totalFuel = 0;
  let totalPrice = 0;
  let previousRefuel;

  for (const refuel of refuels) {
    const refuelData = {
      pricePerLiter: refuel.totalPrice / refuel.fuelAmount,
      consumption: undefined,
      distance: undefined,
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
      value: flatten(refuelData),
    });
  }

  const stats = {
    refuelCount,
    totalDistance,
    totalFuel,
    totalPrice,
    averageConsumption: undefined,
    averagePricePerDistance: undefined,
    averagePricePerVolume: undefined,
  };

  if (refuels.length) {
    const firstRefuel = refuels[0];

    if (stats.totalDistance && refuelCount > 1) {
      stats.averageConsumption = (stats.totalFuel - firstRefuel.fuelAmount) / stats.totalDistance;
      stats.averagePricePerDistance = (stats.totalPrice - firstRefuel.totalPrice) / stats.totalDistance;
    }

    if (stats.totalFuel) {
      stats.averagePricePerVolume = stats.totalPrice / stats.totalFuel;
    }
  }

  updates.push({
    path: `cars/${carId}`,
    operation: 'update',
    value: flatten({
      stats,
      lastRefuel: previousRefuel,
    }),
  });

  return updates;
}

export function deleteField() {
  return Firebase.firestore.FieldValue.delete();
}

function flatten(obj) {
  return flattenValues(obj).reduce((a, b) => ({ ...a, [b.path]: b.value }), {});
}

function flattenValues(obj, path) {
  const type = typeof obj;

  if (obj === null || type === 'undefined') {
    return [{ path, value: deleteField() }];
  }

  if (obj instanceof Firebase.firestore.Timestamp || obj instanceof Date) {
    return obj;
  }

  if (type === 'object') {
    return Object.keys(obj).flatMap((key) => flattenValues(obj[key], path ? `${path}.${key}` : key));
  }

  return { path, value: obj };
}
