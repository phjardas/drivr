const describeFirebaseRules = require('./harness');

describeFirebaseRules('invites', ({ authedApp, adminApp, assertSucceeds, assertFails }) => {
  it('should allow creation of invite is user is car owner', async () => {
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

  it('should deny creation of invite is user is not car owner', async () => {
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
});
