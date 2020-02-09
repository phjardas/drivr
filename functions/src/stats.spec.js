import { deleteField, updateCarStatistics } from './stats';

describe('stats', () => {
  it('should reset car statistics if no refuels', () => {
    const refuels = [];

    const updates = updateCarStatistics(refuels, 'car');
    expect(updates).toEqual([
      {
        path: 'cars/car',
        operation: 'update',
        value: {
          'stats.refuelCount': 0,
          'stats.totalFuel': 0,
          'stats.totalPrice': 0,
          'stats.totalDistance': 0,
          'stats.averageConsumption': deleteField(),
          'stats.averagePricePerDistance': deleteField(),
          'stats.averagePricePerVolume': deleteField(),
          lastRefuel: deleteField(),
        },
      },
    ]);
  });

  it('should calculate basic statistics if one refuel', () => {
    const refuels = [{ id: 1, mileage: 100, fuelAmount: 10, totalPrice: 12 }];

    const updates = updateCarStatistics(refuels, 'car');
    expect(updates).toEqual([
      {
        path: 'cars/car/refuels/1',
        operation: 'update',
        value: {
          distance: deleteField(),
          consumption: deleteField(),
          pricePerLiter: 1.2,
        },
      },
      {
        path: 'cars/car',
        operation: 'update',
        value: {
          'stats.refuelCount': 1,
          'stats.totalFuel': 10,
          'stats.totalPrice': 12,
          'stats.totalDistance': 0,
          'stats.averageConsumption': deleteField(),
          'stats.averagePricePerDistance': deleteField(),
          'stats.averagePricePerVolume': 1.2,
          'lastRefuel.id': 1,
          'lastRefuel.mileage': 100,
          'lastRefuel.fuelAmount': 10,
          'lastRefuel.totalPrice': 12,
          'lastRefuel.pricePerLiter': 1.2,
          'lastRefuel.distance': deleteField(),
          'lastRefuel.consumption': deleteField(),
        },
      },
    ]);
  });

  it('should calculate full statistics if two refuel', () => {
    const refuels = [
      { id: 1, mileage: 100, fuelAmount: 10, totalPrice: 12 },
      { id: 2, mileage: 300, fuelAmount: 20, totalPrice: 24 },
    ];

    const updates = updateCarStatistics(refuels, 'car');
    expect(updates).toEqual([
      {
        path: 'cars/car/refuels/1',
        operation: 'update',
        value: {
          distance: deleteField(),
          consumption: deleteField(),
          pricePerLiter: 1.2,
        },
      },
      {
        path: 'cars/car/refuels/2',
        operation: 'update',
        value: {
          distance: 200,
          consumption: 0.1,
          pricePerLiter: 1.2,
        },
      },
      {
        path: 'cars/car',
        operation: 'update',
        value: {
          'stats.refuelCount': 2,
          'stats.totalFuel': 30,
          'stats.totalPrice': 36,
          'stats.totalDistance': 200,
          'stats.averageConsumption': 0.1,
          'stats.averagePricePerDistance': 0.12,
          'stats.averagePricePerVolume': 1.2,
          'lastRefuel.id': 2,
          'lastRefuel.mileage': 300,
          'lastRefuel.fuelAmount': 20,
          'lastRefuel.totalPrice': 24,
          'lastRefuel.pricePerLiter': 1.2,
          'lastRefuel.distance': 200,
          'lastRefuel.consumption': 0.1,
        },
      },
    ]);
  });
});
