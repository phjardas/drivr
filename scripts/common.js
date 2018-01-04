const admin = require('firebase-admin');
require('firebase/firestore');
const config = require('./firebase-config.json');

const firebase = admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: 'https://drivr-f620a.firebaseio.com',
});

const firestore = firebase.firestore();

module.exports = {
  firebase,
  firestore,
  usersRef: firestore.collection('users'),
  carsRef: firestore.collection('cars'),
  refuelsRef: firestore.collection('refuels'),
};
