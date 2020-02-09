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
          stats: { refuelCount: 0 },
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
          stats: {
            refuelCount: 1,
            totalFuel: 10,
            totalPrice: 12,
            totalDistance: 0,
            averageConsumption: deleteField(),
            averagePricePerDistance: deleteField(),
            averagePricePerVolume: 1.2,
          },
          lastRefuel: {
            id: 1,
            mileage: 100,
            fuelAmount: 10,
            totalPrice: 12,
            pricePerLiter: 1.2,
            distance: deleteField(),
            consumption: deleteField(),
          },
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
          stats: {
            refuelCount: 2,
            totalFuel: 30,
            totalPrice: 36,
            totalDistance: 200,
            averageConsumption: 0.1,
            averagePricePerDistance: 0.12,
            averagePricePerVolume: 1.2,
          },
          lastRefuel: {
            id: 2,
            mileage: 300,
            fuelAmount: 20,
            totalPrice: 24,
            pricePerLiter: 1.2,
            distance: 200,
            consumption: 0.1,
          },
        },
      },
    ]);
  });
});
