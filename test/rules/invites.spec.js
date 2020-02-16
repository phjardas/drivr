const describeFirebaseRules = require('./harness');

describeFirebaseRules('invites', ({ authedApp, adminApp, assertSucceeds, assertFails }) => {
  it('should allow creation of invite if user is car owner', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ ownerId: 'test', users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(id)
        .collection('invites')
        .add({})
    );
  });

  it('should deny creation of invite if user is not car owner', async () => {
    const id = 'car';
    await adminApp()
      .collection('cars')
      .doc(id)
      .set({ ownerId: 'another', users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .collection('invites')
        .add({})
    );
  });

  it('should allow direct read access to any invite', async () => {
    const carId = 'car';
    const inviteId = 'invite';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({});
    await admin
      .collection('cars')
      .doc(carId)
      .collection('invites')
      .doc(inviteId)
      .set({});

    const db = authedApp();
    await assertSucceeds(
      db
        .collection('cars')
        .doc(carId)
        .collection('invites')
        .doc(inviteId)
        .get()
    );
  });

  it('should deny listing invites for a car', async () => {
    const carId = 'car';
    const inviteId = 'invite';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({});
    await admin
      .collection('cars')
      .doc(carId)
      .collection('invites')
      .doc(inviteId)
      .set({});

    const db = authedApp();
    await assertFails(
      db
        .collection('cars')
        .doc(carId)
        .collection('invites')
        .get()
    );
  });

  it('should deny editing an invitation', async () => {
    const carId = 'car';
    const inviteId = 'invite';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({});
    await admin
      .collection('cars')
      .doc(carId)
      .collection('invites')
      .doc(inviteId)
      .set({});

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(carId)
        .collection('invites')
        .doc(inviteId)
        .update({ acceptedBy: 'test' })
    );
  });

  it('should deny deleting an invitation', async () => {
    const carId = 'car';
    const inviteId = 'invite';
    const admin = adminApp();
    await admin
      .collection('cars')
      .doc(carId)
      .set({});
    await admin
      .collection('cars')
      .doc(carId)
      .collection('invites')
      .doc(inviteId)
      .set({});

    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('cars')
        .doc(carId)
        .collection('invites')
        .doc(inviteId)
        .delete()
    );
  });
});
