const describeFirebaseRules = require('./harness');

describeFirebaseRules('refuels', ({ authedApp, adminApp, assertSucceeds, assertFails }) => {
  it('should allow read of refuels if user is in `users`', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .get()
    );
  });

  it('should deny read of refuels if user is not in `users`', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'another' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .get()
    );
  });

  it('should allow creation of complete refuel if user is in `users`', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          date: new Date(),
          mileage: 100,
          fuelAmount: 12.34,
          totalPrice: 23.45,
          userId: 'test',
        })
    );
  });

  it('should deny creation of incomplete refuel if `date` is missing', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          mileage: 100,
          fuelAmount: 12.34,
          totalPrice: 23.45,
          userId: 'test',
        })
    );
  });

  it('should deny creation of incomplete refuel if `mileage` is missing', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          date: new Date(),
          fuelAmount: 12.34,
          totalPrice: 23.45,
          userId: 'test',
        })
    );
  });

  it('should deny creation of incomplete refuel if `fuelAmount` is missing', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          date: new Date(),
          mileage: 100,
          totalPrice: 23.45,
          userId: 'test',
        })
    );
  });

  it('should deny creation of incomplete refuel if `totalPrice` is missing', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          date: new Date(),
          mileage: 100,
          fuelAmount: 12.34,
          userId: 'test',
        })
    );
  });

  it('should deny creation of incomplete refuel if `userId` is missing', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          date: new Date(),
          mileage: 100,
          fuelAmount: 12.34,
          totalPrice: 23.45,
        })
    );
  });

  it('should deny creation of incomplete refuel if `userId` is incorrect', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('refuels')
        .add({
          date: new Date(),
          mileage: 100,
          fuelAmount: 12.34,
          totalPrice: 23.45,
          userId: 'another',
        })
    );
  });

  it('should allow deletion of refuel if user is car owner', async () => {
    const carId = 'car';
    const refuelId = 'refuel';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({ ownerId: 'test', users: { test: true } });
    await admin
      .collection('cars')
      .doc(carId)
      .collection('refuels')
      .doc(refuelId)
      .set({
        date: new Date(),
        mileage: 100,
        fuelAmount: 12.34,
        totalPrice: 23.45,
        userId: 'another',
      });

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(carId)
        .collection('refuels')
        .doc(refuelId)
        .delete()
    );
  });

  it('should allow deletion of refuel if user created the refuel', async () => {
    const carId = 'car';
    const refuelId = 'refuel';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({ ownerId: 'another', users: { test: true } });
    await admin
      .collection('cars')
      .doc(carId)
      .collection('refuels')
      .doc(refuelId)
      .set({
        date: new Date(),
        mileage: 100,
        fuelAmount: 12.34,
        totalPrice: 23.45,
        userId: 'test',
      });

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(carId)
        .collection('refuels')
        .doc(refuelId)
        .delete()
    );
  });

  it('should deny deletion of refuel if user is not car owner and did not create the refuel', async () => {
    const carId = 'car';
    const refuelId = 'refuel';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({ ownerId: 'another', users: { test: true } });
    await admin
      .collection('cars')
      .doc(carId)
      .collection('refuels')
      .doc(refuelId)
      .set({
        date: new Date(),
        mileage: 100,
        fuelAmount: 12.34,
        totalPrice: 23.45,
        userId: 'another',
      });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(carId)
        .collection('refuels')
        .doc(refuelId)
        .delete()
    );
  });
});
