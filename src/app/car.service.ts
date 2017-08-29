import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Car } from './car.model';
import { Refuel } from './refuel.model';

export { Car, Refuel };

function find(values: Car[], predicate: (Car) => boolean): Car {
  const matches = values.filter(predicate);
  return matches.length ? matches[0] : null;
}

@Injectable()
export class CarService {
  public user: Observable<firebase.User>;
  public cars: Observable<Car[]>

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {
    this.user = auth.authState;
    this.cars = this.user.mergeMap(user => db.list(`/cars/${user.uid}`)
      .map(datas => datas.map(data => new Car(data))));
  }

  getCar(id: String): Observable<Car> {
    return this.cars.map(cars => find(cars, (car: Car) => car.id === id));
  }

  getRefuels(carId: String): Observable<Refuel[]> {
    return this.user.mergeMap(user => this.db.list(`/refuels/${user.uid}/${carId}`)
      .map(refuels => refuels.map(data => new Refuel(data))));
  }

  signin() {
    this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signout() {
    this.auth.auth.signOut();
  }
}
