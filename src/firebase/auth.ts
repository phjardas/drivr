import * as firebase from 'firebase/app';
import 'firebase/auth';
import './init';

if (!firebase.auth) throw new Error('Firebase Authentication is not available');
export const auth = firebase.auth();
export const authModule = firebase.auth;
