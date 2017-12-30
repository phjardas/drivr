import { FirebaseOptions } from '@firebase/app-types';

export const config: FirebaseOptions =
  process.env.NODE_ENV === 'production'
    ? {
        apiKey: 'AIzaSyD5IlsvQ5Ie2mUAsbENSc_BPpLpmF-yJzw',
        authDomain: 'drivr-f620a.firebaseapp.com',
        databaseURL: 'https://drivr-f620a.firebaseio.com',
        projectId: 'drivr-f620a',
        storageBucket: 'drivr-f620a.appspot.com',
        messagingSenderId: '908979870448',
      }
    : {
        apiKey: 'AIzaSyD1S_pjLMUUGFI78XC4cyyKRs9ba0rcktc',
        authDomain: 'drivr-dev-4fa43.firebaseapp.com',
        databaseURL: 'https://drivr-dev-4fa43.firebaseio.com',
        projectId: 'drivr-dev-4fa43',
        storageBucket: 'drivr-dev-4fa43.appspot.com',
        messagingSenderId: '380534664070',
      };
