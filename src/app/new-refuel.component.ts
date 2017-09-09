import 'rxjs/add/operator/switchMap';

import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CarService, Car, Refuel } from './car.service';

@Component({
  selector: 'new-refuel',
  templateUrl: 'new-refuel.component.html'
})
export class NewRefuelComponent {
  car: Car;
  form: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private carService: CarService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      time: [new Date().toISOString().substring(11, 16), Validators.required],
      mileage: [null, Validators.required],
      fuelAmount: [null, Validators.required],
      totalPrice: [null, Validators.required],
      distance: null,
      consumption: null,
      pricePerLiter: null,
    });

    const updateDependentValues = this.updateDependentValues.bind(this);
    ['mileage', 'fuelAmount', 'totalPrice'].forEach(field => this.form.get(field).valueChanges.forEach(updateDependentValues));
  }

  updateDependentValues() {
    const { mileage, fuelAmount, totalPrice } = this.form.value;
    let distance: number = null;
    let consumption: number = null;
    let pricePerLiter: number = null;

    if (mileage && this.car.lastRefuel) {
      distance = mileage - this.car.lastRefuel.mileage;
      if (distance < 0) distance = null;
    }

    if (distance && fuelAmount) {
      consumption = fuelAmount / distance;
    }

    if (totalPrice && fuelAmount) {
      pricePerLiter = totalPrice / fuelAmount;
    }

    this.form.patchValue({ distance, consumption, pricePerLiter });
  }

  submit() {
    const refuel = new Refuel(Object.assign({}, this.form.value, {
      date: new Date(`${this.form.value.date}T${this.form.value.time}:00`),
    }));

    this.carService.addRefuel(this.car.id, refuel)
      .then(_=> this.router.navigate(['/cars', this.car.id]))
      .catch(err => console.error('error saving:', err));
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap(params => this.carService.getCar(params.get('id')))
      .subscribe(car => this.car = car);
  }
}
