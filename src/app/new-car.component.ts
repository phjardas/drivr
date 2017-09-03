import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CarService, Car } from './car.service';

@Component({
  selector: 'new-car',
  templateUrl: 'new-car.component.html'
})
export class NewCarComponent {
  form: FormGroup;

  constructor(private router: Router, private carService: CarService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      licensePlate: [null, Validators.required],
    });
  }

  submit() {
    const car = new Car(Object.assign({}, this.form.value));

    this.carService.addCar(car)
      .then(c => this.router.navigate(['/cars', c.id]))
      .catch(err => console.error('error saving:', err));
  }
}
