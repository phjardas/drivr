import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

import { AuthenticationService, AuthenticationProvider } from './authentication.service';
import { CarService, Car } from './car.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  user: User;
  authenticationProviders: AuthenticationProvider[];
  cars: Observable<Car[]>;

  constructor(private carService: CarService, private authenticationService: AuthenticationService) {
    authenticationService.user.subscribe(user => this.user = user);
    this.authenticationProviders = authenticationService.providers;
    this.cars = carService.cars;
  }

  signin(type) {
    this.authenticationService.signin(type);
  }

  signout() {
    this.authenticationService.signout();
  }
}
