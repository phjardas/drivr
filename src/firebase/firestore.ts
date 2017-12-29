import * as firebase from 'firebase/app';
import 'firebase/firestore';
import './init';

if (!firebase.firestore) throw new Error('Firestore is not available');
export const firestore = firebase.firestore();
export const firestoreModule = firebase.firestore;
