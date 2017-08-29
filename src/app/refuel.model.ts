export class Refuel {
  public id: String;
  public date: Date;
  public mileage: number;
  public fuelAmount: number;
  public totalPrice: number;
  public distance: number;
  public consumption: number;
  public pricePerLiter: number;

  constructor(data) {
    this.id = data.id ? data.id : data.$key;
    this.date = new Date(data.date);
    this.mileage = parseInt(data.mileage);
    this.fuelAmount = parseFloat(data.fuelAmount);
    this.totalPrice = parseFloat(data.totalPrice);
    this.distance = parseFloat(data.distance);
    this.consumption = parseFloat(data.consumption);
    this.pricePerLiter = parseFloat(data.pricePerLiter);
  }
}
