import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from 'firebase/app';

import { AuthenticationService, AuthenticationProvider } from './authentication.service';
import { CarService, Car } from './car.service';


function compareCars(a: Car, b: Car): number {
  // TODO sort by last refuel
  return a.licensePlate.localeCompare(b.licensePlate);
}


@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html'
})
export class MainMenuComponent {
  user: User;
  authenticationProviders: AuthenticationProvider[];
  cars: Observable<Car[]>;

  constructor(private carService: CarService, private authenticationService: AuthenticationService) {
    authenticationService.user.subscribe(user => this.user = user);
    this.authenticationProviders = authenticationService.providers;
    this.cars = carService.cars.map(cars => cars.sort(compareCars));
  }

  signin(type) {
    this.authenticationService.signin(type);
  }

  signout() {
    this.authenticationService.signout();
  }
}
