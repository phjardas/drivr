import decimal from 'decimal.js';

export class Refuel {
  constructor(props) {
    this.id = props.id;
    this.date = props.date;
    this.mileage = props.mileage;
    this.fuelAmount = decimal(props.fuelAmount);
    this.totalPrice = decimal(props.totalPrice);
    this.pricePerLiter = this.fuelAmount.greaterThan(decimal(0)) && this.totalPrice.div(this.fuelAmount);
  }
}
