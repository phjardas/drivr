import Names from './names';
import firebase from '../service/firebase';
import store from '../store';

const listeners = {};

export function on(type, listener) {
  (listeners[type] = listeners[type] || []).push(listener);
}

function emit(type, ...args) {
  (listeners[type] || []).forEach(listener => listener(...args));
}

const auth = firebase.auth();

setTimeout(() => {
  auth.onAuthStateChanged(user => {
    const currentUser = store.getState().auth.user;

    if (user) {
      const usr = {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      store.dispatch({
        type: Names.User.login,
        payload: usr,
      });

      emit('signin', usr);
    } else if (currentUser) {
      store.dispatch({ type: Names.User.logout, payload: currentUser });
      emit('signout', currentUser);
    }
  });
}, 0);

export const AuthenticationMethods = {
/*
  email: {
    label: 'Email/Password',
    provider: new firebase.auth.EmailAuthProvider(),
    iconUrl: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_email.svg',
  },
*/
  google: {
    label: 'Google',
    provider: new firebase.auth.GoogleAuthProvider(),
    iconUrl: 'https://www.gstatic.com/mobilesdk/160512_mobilesdk/auth_service_google.svg',
  },
/*
  facebook: {
    label: 'Facebook',
    provider: new firebase.auth.FacebookAuthProvider(),
    iconUrl: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_facebook.svg',
  },
*/
  github: {
    label: 'GitHub',
    provider: new firebase.auth.GithubAuthProvider(),
    iconUrl: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_github.svg',
  },
/*
  twitter: {
    label: 'Twitter',
    provider: new firebase.auth.TwitterAuthProvider(),
    iconUrl: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_twitter.svg',
  },
*/
};

export function signIn(type) {
  return () => auth.signInWithPopup(AuthenticationMethods[type].provider);
}

export function signOut() {
  return () => auth.signOut();
}
