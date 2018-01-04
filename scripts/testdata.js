const moment = require('moment');
const { carsRef, refuelsRef } = require('./common');

function randomString(length, alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  const size = alphabet.length;
  let s = '';
  for (let i = 0; i < length; i++) s += alphabet.charAt(Math.floor(Math.random() * size));
  return s;
}

function randomNumber(min, max) {
  return parseInt(min + Math.floor(Math.random() * (max - min + 1)));
}

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function round(value, precision) {
  const exp = Math.pow(10, precision);
  return Math.round(value * exp) / exp;
}

function randomLicensePlate() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ';
  const numbers = '0123456789';

  const prefixLength = randomNumber(1, 3);
  const middleLength = randomNumber(1, 2);
  const numberLength = randomNumber(1, 3);

  return `${randomString(prefixLength, letters)}-${randomString(middleLength, letters)} ${randomString(1, '123456789')}${randomString(numberLength, numbers)}`;
}

async function createCar({ userId }) {
  console.log('Creating car...');
  const carData = {
    label: randomLicensePlate(),
    ownerId: userId,
    users: { [userId]: true },
  };
  const ref = await carsRef.add(carData);
  const car = { ...carData, id: ref.id };
  console.log('Car created with label "%s": %s', car.label, car.id);
  return car;
}

async function createRefuels({ carId, userId, count }) {
  console.log('Creating %d refuels...', count);

  let date = moment().subtract(count, 'days');
  let mileage = randomNumber(0, 1000);
  const averageConsumption = randomFloat(.05, .08);
  const averagePrice = randomFloat(1.0, 1.4);
  const averageDistance = randomNumber(500, 1000);

  for (let i = 0; i < count; i++) {
    console.log('Creating refuel #%d', i + 1);
    const distance = randomNumber(averageDistance * .8, averageDistance * 1.2);
    const consumption = randomFloat(averageConsumption * .7, averageConsumption * 1.3);
    const price = round(randomFloat(averagePrice * .7, averagePrice * 1.3), 2) + 0.009;
    const fuelAmount = round(distance * consumption, 2);
    const totalPrice = round(fuelAmount * price, 2);
    const oldMileage = mileage;
    mileage += distance;

    const refuelData = {
      carId,
      createdAt: date.toDate(),
      date: date.toDate(),
      mileage,
      fuelAmount,
      totalPrice,
      pricePerLiter: price,
      userId,
    };

    if (i > 0) {
      refuelData.consumption = consumption;
      refuelData.distance = distance;
    }

    const ref = await refuelsRef.add(refuelData);
    await carsRef.doc(carId).update({ lastRefuel: { ...refuelData, id: ref.id }});
    console.log('Created refuel #%d: %s', i + 1, ref.id);

    date = date.add(1, 'days');
  }
}

async function createTestData({ userId, carId, count }) {
  const actualCarId = carId ? carId : (await createCar({ userId })).id;
  await createRefuels({ userId, carId: actualCarId, count });
}

async function main() {
  const args = require('yargs')
    .option('user', { demand: true })
    .option('car')
    .option('refuels', { number: true, demand: true })
    .argv;

  const userId = args.user;
  const carId = args.car;
  const count = args.refuels;

  await createTestData({ userId, carId, count });
}

main()
  .then(() => console.log('done'))
  .catch(err => console.error('ERROR:', err));
