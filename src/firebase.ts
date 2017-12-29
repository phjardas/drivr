import * as firebase from 'firebase/app';
import { FirebaseOptions } from '@firebase/app-types';
import 'firebase/auth';
import 'firebase/firestore';

const config: FirebaseOptions = {
  apiKey: 'AIzaSyD1S_pjLMUUGFI78XC4cyyKRs9ba0rcktc',
  authDomain: 'drivr-dev-4fa43.firebaseapp.com',
  databaseURL: 'https://drivr-dev-4fa43.firebaseio.com',
  projectId: 'drivr-dev-4fa43',
  storageBucket: 'drivr-dev-4fa43.appspot.com',
  messagingSenderId: '380534664070',
};

firebase.initializeApp(config);

if (!firebase.auth) throw new Error('Firebase Authentication is not available');
export const auth = firebase.auth();
export const authModule = firebase.auth;

if (!firebase.firestore) throw new Error('Firestore is not available');
export const firestore = firebase.firestore();
export const firestoreModule = firebase.firestore;
