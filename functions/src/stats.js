import { flatten } from './utils';

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
