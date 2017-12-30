import admin from 'firebase-admin';
import 'firebase/firestore';
import * as config from './firebase-config.json';

export const firebase = admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: 'https://drivr-f620a.firebaseio.com',
});

export const firestore = firebase.firestore();
export const usersRef = firestore.collection('users');
export const carsRef = firestore.collection('cars');
export const refuelsRef = firestore.collection('refuels');
