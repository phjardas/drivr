const describeFirebaseRules = require('./harness');

describeFirebaseRules('users', ({ authedApp, adminApp, assertSucceeds, assertFails }) => {
  it('should deny access to a user profile if anonymous', async () => {
    const db = authedApp(null);
    await assertFails(
      db
        .collection('users')
        .doc('test')
        .get()
    );
  });

  it('should allow access to any user profile if authenticated', async () => {
    const admin = adminApp();
    await admin
      .collection('users')
      .doc('test')
      .set({});

    const db = authedApp({ uid: 'another' });
    await assertSucceeds(
      db
        .collection('users')
        .doc('test')
        .get()
    );
  });

  it('should allow a user to create their own profile', async () => {
    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('users')
        .doc('test')
        .set({})
    );
  });

  it('should deny a user to create other profiles', async () => {
    const db = authedApp({ uid: 'test' });
    await assertFails(
      db
        .collection('users')
        .doc('another')
        .set({ id: 'anoter' })
    );
  });

  it('should allow updates to own user profile', async () => {
    const admin = adminApp();
    await admin
      .collection('users')
      .doc('test')
      .set({});

    const db = authedApp({ uid: 'test' });
    await assertSucceeds(
      db
        .collection('users')
        .doc('test')
        .update({ label: 'Test' })
    );
  });

  it('should deny updates to other user profiles', async () => {
    const admin = adminApp();
    await admin
      .collection('users')
      .doc('test')
      .set({});

    const db = authedApp({ uid: 'another' });
    await assertFails(
      db
        .collection('users')
        .doc('test')
        .update({ label: 'Test' })
    );
  });
});
