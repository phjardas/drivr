import * as firebase from 'firebase/app';
import { FirebaseOptions } from '@firebase/app-types';
import 'firebase/auth';
import 'firebase/firestore';

const config: FirebaseOptions = {
  apiKey: 'AIzaSyD5IlsvQ5Ie2mUAsbENSc_BPpLpmF-yJzw',
  authDomain: 'drivr-f620a.firebaseapp.com',
  databaseURL: 'https://drivr-f620a.firebaseio.com',
  projectId: 'drivr-f620a',
  storageBucket: 'drivr-f620a.appspot.com',
  messagingSenderId: '908979870448',
};

firebase.initializeApp(config);

if (!firebase.auth) throw new Error('Firebase Authentication is not available');
export const auth = firebase.auth();
export const authModule = firebase.auth;

if (!firebase.firestore) throw new Error('Firestore is not available');
export const firestore = firebase.firestore();
export const firestoreModule = firebase.firestore;
