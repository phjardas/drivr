export class Stats {
  public averageConsumption: number;
  public averagePricePerDistance: number;
  public averagePricePerVolume: number;
  public refuelCount: number;
  public totalDistance: number;
  public totalFuel: number;
  public totalPrice: number;

  constructor(data) {
    this.averageConsumption = data.averageConsumption;
    this.averagePricePerDistance = data.averagePricePerDistance;
    this.averagePricePerVolume = data.averagePricePerVolume;
    this.refuelCount = data.refuelCount;
    this.totalDistance = data.totalDistance;
    this.totalFuel = data.totalFuel;
    this.totalPrice = data.totalPrice;
  }
}
