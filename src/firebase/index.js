import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { config } from './config';

export const firebase = Firebase.initializeApp(config);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export { Firebase };

firestore.enablePersistence().catch((error) => console.error('Error enabling Firestore persistence:', error));
