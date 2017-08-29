import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

import { CarService, Car } from './car.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  user: User;
  cars: Observable<Car[]>

  constructor(private carService: CarService) {
    carService.user.subscribe(user => this.user = user);
    this.cars = carService.cars;
  }

  signin() {
    this.carService.signin();
  }

  signout() {
    this.carService.signout();
  }
}
