export class Stats {
  public averageConsumption: number;
  public averagePricePerDistance: number;
  public averagePricePerVolume: number;
  public refuelCount: number;
  public totalDistance: number;
  public totalFuel: number;
  public totalPrice: number;

  constructor(data: {
    averageConsumption?: number,
    averagePricePerDistance?: number,
    averagePricePerVolume?: number,
    refuelCount?: number,
    totalDistance?: number,
    totalFuel?: number,
    totalPrice?: number
  }) {
    this.averageConsumption = data.averageConsumption;
    this.averagePricePerDistance = data.averagePricePerDistance;
    this.averagePricePerVolume = data.averagePricePerVolume;
    this.refuelCount = data.refuelCount || 0;
    this.totalDistance = data.totalDistance || 0;
    this.totalFuel = data.totalFuel || 0;
    this.totalPrice = data.totalPrice || 0;
  }
}
