import * as firebase from 'firebase/app';
import { config } from './config';

let initialized = false;
if (!initialized) {
  initialized = true;
  firebase.initializeApp(config);
}
