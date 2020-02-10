import { deleteField } from './utils';

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

  const stats = {
    'stats.refuelCount': refuelCount,
    'stats.totalDistance': totalDistance || deleteField(),
    'stats.totalFuel': totalFuel || deleteField(),
    'stats.totalPrice': totalPrice || deleteField(),
    'stats.averageConsumption': deleteField(),
    'stats.averagePricePerDistance': deleteField(),
    'stats.averagePricePerVolume': deleteField(),
  };

  if (refuels.length) {
    const firstRefuel = refuels[0];

    if (totalDistance && refuelCount > 1) {
      stats['stats.averageConsumption'] = (totalFuel - firstRefuel.fuelAmount) / totalDistance;
      stats['stats.averagePricePerDistance'] = (totalPrice - firstRefuel.totalPrice) / totalDistance;
    }

    if (totalFuel) {
      stats['stats.averagePricePerVolume'] = totalPrice / totalFuel;
    }
  }

  updates.push({
    path: `cars/${carId}`,
    operation: 'update',
    value: {
      ...stats,
      ...(previousRefuel ? prefixKeys(previousRefuel, 'lastRefuel') : { lastRefuel: deleteField() }),
    },
  });

  return updates;
}

function prefixKeys(obj, prefix) {
  return Object.keys(obj).reduce((ret, key) => ({ ...ret, [`${prefix}.${key}`]: obj[key] }), {});
}
