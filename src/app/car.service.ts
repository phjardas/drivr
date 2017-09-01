import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import uuid from 'uuid/v1';

import { Car } from './car.model';
import { Refuel } from './refuel.model';
import { Stats } from './stats.model';

export { Car, Refuel, Stats };


function find<T>(values: T[], predicate: (T) => boolean): T {
  const matches = values.filter(predicate);
  return matches.length ? matches[0] : null;
}

function calculateStats(car: Car, refuel: Refuel): Stats {
  const oldStats = car.stats || new Stats({});
  const stats = new Stats({
    refuelCount: (oldStats.refuelCount || 0) + 1,
    totalDistance: refuel.mileage - (car.initialMileage || 0),
    totalFuel: (oldStats.totalFuel || 0) + refuel.fuelAmount,
    totalPrice: (oldStats.totalPrice || 0) + refuel.totalPrice,
  });

  if (stats.totalDistance && stats.totalFuel) {
    stats.averageConsumption = stats.totalFuel / stats.totalDistance;
  }

  if (stats.totalDistance && stats.totalPrice) {
    stats.averagePricePerDistance = stats.totalPrice / stats.totalDistance;
  }

  if (stats.totalPrice && stats.totalFuel) {
    stats.averagePricePerVolume = stats.totalPrice / stats.totalFuel;
  }

  return stats;
}


@Injectable()
export class CarService {
  public user = new BehaviorSubject<firebase.User>(null);
  public cars = new BehaviorSubject<Car[]>([]);

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {
    auth.authState.subscribe(this.user.next.bind(this.user));

    this.user
      .filter(user => user != null)
      .mergeMap(user => db.list(`/cars/${user.uid}`)
      .map(datas => datas.map(data => new Car(data))))
      .subscribe(this.cars.next.bind(this.cars));
  }

  getCar(id: String): Observable<Car> {
    return this.cars.map(cars => find(cars, car => car.id === id));
  }

  getRefuels(carId: String): Observable<Refuel[]> {
    return this.user
      .filter(user => user != null)
      .mergeMap(user => this.db.list(`/refuels/${user.uid}/${carId}`)
      .map(refuels => refuels.map(data => new Refuel(data))));
  }

  addRefuel(carId: String, refuel: Refuel): Promise<void> {
    return this.user.first().mergeMap(user => {
      return this.getCar(carId).first().mergeMap(car => {
        return this._saveRefuel(user, car, refuel);
      });
    }).toPromise();
  }

  _saveRefuel(user: firebase.User, car: Car, refuel: Refuel): Observable<void> {
    const stats = calculateStats(car, refuel);
    const id = uuid();
    const refuelData = JSON.parse(JSON.stringify(refuel));
    delete refuelData.id;
    const updates = {
      [`/refuels/${user.uid}/${car.id}/${id}`]: refuelData,
      [`/cars/${user.uid}/${car.id}/stats`]: stats,
      [`/cars/${user.uid}/${car.id}/lastRefuel`]: refuelData,
    };
    return Observable.fromPromise(this.db.object('/').update(updates));
  }

  signin() {
    this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signout() {
    this.auth.auth.signOut();
  }
}
