import decimal from 'decimal.js';

function parseDecimal(val) {
  try {
    return decimal(val);
  } catch (e) {
    // ignored
  }
}

export class Refuel {
  constructor(props, car) {
    this.id = props.id;
    this.carId = car ? car.id : props.carId;
    this.date = props.date;
    this.mileage = props.mileage;
    this.fuelAmount = parseDecimal(props.fuelAmount);
    this.totalPrice = parseDecimal(props.totalPrice);
    this.pricePerLiter = this.fuelAmount && this.totalPrice && this.fuelAmount.greaterThan(decimal(0))
      ? this.totalPrice.div(this.fuelAmount)
      : null;

    if (car) {
      this.calculateDependents(car);
    }
  }

  calculateDependents(car) {
    const lastMileage = car.lastRefuel ? car.lastRefuel.mileage : car.initialMileage;
    this.distance = this.mileage ? this.mileage - lastMileage : null;

    if (this.fuelAmount && this.distance && this.distance > 0) {
      this.consumption = this.fuelAmount.div(decimal(this.distance));
    }
  }

  toJS() {
    return {
      carId: this.carId,
      date: this.date,
      mileage: this.mileage,
      fuelAmount: this.fuelAmount ? this.fuelAmount.toString() : null,
      totalPrice: this.totalPrice ? this.totalPrice.toString() : null,
      pricePerLiter: this.pricePerLiter ? this.pricePerLiter.toString() : null,
      distance: this.distance,
      consumption: this.consumption ? this.consumption.toString() : null,
    };
  }
}
