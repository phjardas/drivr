import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


export interface AuthenticationProvider {
  id: String,
  label: String,
  icon: String,
  providerFactory: () => firebase.auth.AuthProvider,
}


@Injectable()
export class AuthenticationService {
  public user = new BehaviorSubject<firebase.User>(null);
  public providers : AuthenticationProvider[] = [
    {
      id: 'google',
      label: 'Google',
      icon: 'google',
      providerFactory: () => new firebase.auth.GoogleAuthProvider(),
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: 'github',
      providerFactory: () => new firebase.auth.GithubAuthProvider(),
    },
  ];

  constructor(private auth: AngularFireAuth) {
    auth.authState.subscribe(this.user.next.bind(this.user));
  }

  private getSigninProvider(type: string): firebase.auth.AuthProvider {
    const match = this.providers.find(provider => provider.id === type);
    if (!match) throw new Error(`Invalid authentication provider: ${type}`);
    return match.providerFactory();
  }

  signin(type) {
    const provider = this.getSigninProvider(type);
    this.auth.auth.signInWithPopup(provider);
  }

  signout() {
    this.auth.auth.signOut();
  }
}
