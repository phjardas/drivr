const firebase = require('@firebase/testing');
const fs = require('fs');
const path = require('path');

const projectId = 'drivr-f620a';
const rules = fs.readFileSync(path.resolve(__dirname, '..', 'firestore.rules'), 'utf8');

function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

function adminApp() {
  return firebase.initializeAdminApp({ projectId }).firestore();
}

describe('firestore rules', () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  describe('users', () => {
    it('should deny access to a user profile if anonymous', async () => {
      const db = authedApp(null);
      await firebase.assertFails(
        db
          .collection('users')
          .doc('test')
          .get()
      );
    });

    it('should allow access to any user profile if authenticated', async () => {
      const admin = adminApp();
      admin
        .collection('users')
        .doc('test')
        .set({ id: 'test' });

      const db = authedApp({ uid: 'another' });
      await firebase.assertSucceeds(
        db
          .collection('users')
          .doc('test')
          .get()
      );
    });

    it('should allow a user to create their own profile', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertSucceeds(
        db
          .collection('users')
          .doc('test')
          .set({ id: 'test' })
      );
    });

    it('should deny a user to create other profiles', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertFails(
        db
          .collection('users')
          .doc('another')
          .set({ id: 'anoter' })
      );
    });

    it('should allow updates to own user profile', async () => {
      const admin = adminApp();
      admin
        .collection('users')
        .doc('test')
        .set({ id: 'test' });

      const db = authedApp({ uid: 'test' });
      await firebase.assertSucceeds(
        db
          .collection('users')
          .doc('test')
          .update({ label: 'Test' })
      );
    });

    it('should deny updates to other user profiles', async () => {
      const admin = adminApp();
      admin
        .collection('users')
        .doc('test')
        .set({ id: 'test' });

      const db = authedApp({ uid: 'another' });
      await firebase.assertFails(
        db
          .collection('users')
          .doc('test')
          .update({ label: 'Test' })
      );
    });
  });

  describe('cars', () => {
    it('should allow read of car if user is in `users`', async () => {
      const { id } = await adminApp()
        .collection('cars')
        .add({ users: { test: true } });

      const db = authedApp({ uid: 'test' });
      await firebase.assertSucceeds(
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
      await firebase.assertFails(
        db
          .collection('cars')
          .doc(id)
          .get()
      );
    });

    it('should allow creation of new car if user is owner', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertSucceeds(db.collection('cars').add({ label: 'Test', ownerId: 'test', users: { test: true } }));
    });

    it('should deny creation of new car if user is not owner', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertFails(db.collection('cars').add({ label: 'Test', ownerId: 'another', users: { test: true, another: true } }));
    });

    it('should deny creation of new car if user is missing from `users`', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertFails(db.collection('cars').add({ label: 'Test', ownerId: 'test' }));
    });

    it('should deny creation of new car if label is missing', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertFails(db.collection('cars').add({ ownerId: 'test', users: { test: true } }));
    });

    it('should deny creation of new car if label is empty', async () => {
      const db = authedApp({ uid: 'test' });
      await firebase.assertFails(db.collection('cars').add({ label: '', ownerId: 'test', users: { test: true } }));
    });

    it('should allow update of car label if user is owner', async () => {
      const db = authedApp({ uid: 'test' });
      const { id } = await db.collection('cars').add({ label: 'Test', ownerId: 'test', users: { test: true } });
      await firebase.assertSucceeds(
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
      await firebase.assertFails(
        db
          .collection('cars')
          .doc(id)
          .update({ label: 'Another' })
      );
    });

    it('should allow delete of car if user is owner', async () => {
      const db = authedApp({ uid: 'test' });
      const { id } = await db.collection('cars').add({ label: 'Test', ownerId: 'test', users: { test: true } });
      await firebase.assertSucceeds(
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
      await firebase.assertFails(
        db
          .collection('cars')
          .doc(id)
          .delete()
      );
    });
  });
});
