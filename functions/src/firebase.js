import admin from 'firebase-admin';

admin.initializeApp();

export default admin;

export const firestore = admin.firestore();

export function executeActions(actions, tx) {
  return Promise.all(actions.map(({ path, operation, value }) => tx[operation](firestore.doc(path), value)));
}
