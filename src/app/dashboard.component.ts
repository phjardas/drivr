import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

import { AuthenticationService, AuthenticationProvider } from './authentication.service';
import { CarService, Car } from './car.service';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  user: Observable<User>;
  authenticationProviders: AuthenticationProvider[];
  cars: Observable<Car[]>;

  constructor(private authService: AuthenticationService, carService: CarService) {
    this.user = authService.user;
    this.authenticationProviders = authService.providers;
    this.cars = carService.cars;
  }

  signin(type) {
    this.authService.signin(type);
  }

  signout() {
    this.authService.signout();
  }
}
