import { usersRef, carsRef, refuelsRef } from './common';

async function main() {
  const usersSnapshot = await usersRef.get();

  await Promise.all(
    usersSnapshot.docs.map(async userDoc => {
      const userId = userDoc.id;
      const carsSnapshot = await userDoc.ref.collection('cars').get();
      await Promise.all(
        carsSnapshot.docs.map(async carDoc => {
          const carId = carDoc.id;
          const car = carDoc.data();
          car.label = car.licensePlate;
          delete car.licensePlate;
          car.ownerId = userId;
          car.users = { [userId]: true };
          console.log('car: %s/%s', userId, carId);
          await carsRef.doc(carId).set(car);

          const refuelsSnapshot = await carDoc.ref.collection('refuels').get();
          await Promise.all(
            refuelsSnapshot.docs.map(async refuelDoc => {
              const refuelId = refuelDoc.id;
              const refuel = refuelDoc.data();
              refuel.mileage = parseInt(refuel.mileage);
              refuel.fuelAmount = parseFloat(refuel.fuelAmount);
              refuel.totalPrice = parseFloat(refuel.totalPrice);
              refuel.pricePerLiter = refuel.totalPrice / refuel.fuelAmount;
              if (refuel.distance) {
                refuel.distance = parseInt(refuel.distance);
                refuel.consumption = refuel.fuelAmount / refuel.distance;
              }
              refuel.date = typeof refuel.date === 'string' ? new Date(refuel.date) : refuel.date;
              refuel.carId = carId;
              refuel.userId = userId;
              refuel.createdAt = refuel.createdAt || refuel.date;

              console.log('refuel: %s/%s/%s', userId, carId, refuelId);
              await refuelsRef.doc(refuelId).set(refuel);
            })
          );
        })
      );
    })
  );
}

main()
  .then(() => console.log('done'))
  .catch(err => console.error('ERROR:', err));
