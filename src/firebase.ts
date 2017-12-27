import * as firebase from 'firebase';
import { FirebaseOptions } from '@firebase/app-types';
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
