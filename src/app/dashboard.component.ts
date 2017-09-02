import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

import { CarService, Car } from './car.service';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  user: Observable<User>;
  cars: Observable<Car[]>

  constructor(private carService: CarService) {
    this.user = carService.user;
    this.cars = carService.cars;
  }
}
