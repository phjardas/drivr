import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import uuid from 'uuid/v1';

import { AuthenticationService } from './authentication.service';
import { Car } from './car.model';
import { Refuel } from './refuel.model';
import { Stats } from './stats.model';

export { Car, Refuel, Stats };


function find<T>(values: T[], predicate: (T) => boolean): T {
  const matches = values.filter(predicate);
  return matches.length ? matches[0] : null;
}

function toData(obj: any): any {
  const data = JSON.parse(JSON.stringify(obj));
  Object.keys(data).filter(key => typeof data[key] === 'undefined').forEach(key => delete data[key]);
  return data;
}


@Injectable()
export class CarService {
  public cars = new BehaviorSubject<Car[]>([]);

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService) {
    auth.user
      .filter(user => user != null)
      .mergeMap(user => db.list(`/cars/${user.uid}`)
      .map(datas => datas.map(data => new Car(data))))
      .subscribe(this.cars.next.bind(this.cars));
  }

  getCar(id: String): Observable<Car> {
    return this.cars.map(cars => find(cars, car => car.id === id));
  }

  addCar(car): Promise<Car> {
    return this._saveCar(car).toPromise();
  }

  _saveCar(car): Observable<Car> {
    const id = uuid();
    const carData = toData(car);

    return this.auth.user.first().mergeMap(user => {
      const res: PromiseLike<Car> = this.db.object(`/cars/${user.uid}/${id}`)
        .set(carData)
        .then(_=> new Car(Object.assign({}, carData, { id })));
      return Observable.fromPromise(res);
    });
  }

  getRefuels(carId: String): Observable<Refuel[]> {
    return this.auth.user
      .filter(user => user != null)
      .mergeMap(user => this.db.list(`/refuels/${user.uid}/${carId}`)
      .map(refuels => refuels.map(data => new Refuel(data))));
  }

  addRefuel(carId: String, refuel: Refuel): Promise<void> {
    return this.auth.user.first().mergeMap(user => {
      return this.getCar(carId).first().mergeMap(car => {
        return this._saveRefuel(user, car, refuel);
      });
    }).toPromise();
  }

  _calculateStats(carId: String, refuel: Refuel): Observable<Stats> {
    return this.getRefuels(carId)
      .map(allRefuels => {
        const refuels = allRefuels.sort((a, b) => a.date.getTime() - b.date.getTime());
        refuels.push(refuel);
        const firstRefuel = refuels[0];
        const stats = new Stats({
          refuelCount: refuels.length,
          totalDistance: refuel.mileage - firstRefuel.mileage,
          totalFuel: refuels.map(r => r.fuelAmount).reduce((a, b) => a + b, 0),
          totalPrice: refuels.map(r => r.totalPrice).reduce((a, b) => a + b, 0),
        });

        if (stats.totalDistance && firstRefuel) {
          stats.averageConsumption = (stats.totalFuel - firstRefuel.fuelAmount) / stats.totalDistance;
        }

        if (stats.totalDistance && firstRefuel) {
          stats.averagePricePerDistance = (stats.totalPrice - firstRefuel.totalPrice) / stats.totalDistance;
        }

        if (stats.totalPrice && stats.totalFuel) {
          stats.averagePricePerVolume = stats.totalPrice / stats.totalFuel;
        }

        return stats;
      });
  }

  _saveRefuel(user: firebase.User, car: Car, refuel: Refuel): Observable<void> {
    return this._calculateStats(car.id, refuel).first().mergeMap(stats => {
      const id = uuid();
      const refuelData = toData(refuel);
      const updates = {
        [`/refuels/${user.uid}/${car.id}/${id}`]: refuelData,
        [`/cars/${user.uid}/${car.id}/lastRefuel`]: refuelData,
        [`/cars/${user.uid}/${car.id}/stats`]: toData(stats),
      };

      return Observable.fromPromise(this.db.object('/').update(updates)).toPromise();
    });
  }
}
