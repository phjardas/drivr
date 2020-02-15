const firebase = require('@firebase/testing');
const fs = require('fs');
const path = require('path');

const projectId = 'drivr-f620a';
const rules = fs.readFileSync(path.resolve(__dirname, '..', '..', 'firestore.rules'), 'utf8');

module.exports = function describeFirebaseRules(name, next) {
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

    const context = {
      ...firebase,
      authedApp(auth) {
        return firebase.initializeTestApp({ projectId, auth }).firestore();
      },
      adminApp() {
        return firebase.initializeAdminApp({ projectId }).firestore();
      },
    };

    describe(name, () => next(context));
  });
};
