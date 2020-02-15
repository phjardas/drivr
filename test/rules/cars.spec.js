const describeFirebaseRules = require('./harness');

describeFirebaseRules('cars', ({ authedApp, adminApp, assertSucceeds, assertFails }) => {
  it('should allow read of car if user is in `users`', async () => {
    const { id } = await adminApp()
      .collection('cars')
      .add({ users: { test: true } });

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(id)
        .get()
    );
  });

  it('should deny read of car if user is not in `users`', async () => {
    const { id } = await adminApp()
      .collection('cars')
      .add({ users: { test: true } });

    const db = authedApp({ uid: 'another' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .get()
    );
  });

  it('should allow creation of new car if user is owner', async () => {
    const db = authedApp({ uid: 'test' });
    await assertSucceeds(db.collection('cars').add({ label: 'Test', ownerId: 'test', users: { test: true } }));
  });

  it('should deny creation of new car if user is not owner', async () => {
    const db = authedApp({ uid: 'test' });
    await assertFails(db.collection('cars').add({ label: 'Test', ownerId: 'another', users: { test: true, another: true } }));
  });

  it('should deny creation of new car if user is missing from `users`', async () => {
    const db = authedApp({ uid: 'test' });
    await assertFails(db.collection('cars').add({ label: 'Test', ownerId: 'test' }));
  });

  it('should deny creation of new car if label is missing', async () => {
    const db = authedApp({ uid: 'test' });
    await assertFails(db.collection('cars').add({ ownerId: 'test', users: { test: true } }));
  });

  it('should deny creation of new car if label is empty', async () => {
    const db = authedApp({ uid: 'test' });
    await assertFails(db.collection('cars').add({ label: '', ownerId: 'test', users: { test: true } }));
  });

  it('should allow update of car label if user is owner', async () => {
    const db = authedApp({ uid: 'test' });
    const { id } = await db.collection('cars').add({ label: 'Test', ownerId: 'test', users: { test: true } });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(id)
        .update({ label: 'Another' })
    );
  });

  it('should deny update of car label if user is not owner', async () => {
    const { id } = await adminApp()
      .collection('cars')
      .add({ label: 'Test', ownerId: 'test', users: { test: true } });

    const db = authedApp({ uid: 'another' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .update({ label: 'Another' })
    );
  });

  it('should allow delete of car if user is owner', async () => {
    const db = authedApp({ uid: 'test' });
    const { id } = await db.collection('cars').add({ label: 'Test', ownerId: 'test', users: { test: true } });
    await assertSucceeds(
      db
        .collection('cars')
        .doc(id)
        .delete()
    );
  });

  it('should deny delete of car if user is not owner', async () => {
    const { id } = await adminApp()
      .collection('cars')
      .add({ label: 'Test', ownerId: 'test', users: { test: true } });

    const db = authedApp({ uid: 'another' });
    await assertFails(
      db
        .collection('cars')
        .doc(id)
        .delete()
    );
  });
});
