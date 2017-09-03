import { Refuel } from './refuel.model';
import { Stats } from './stats.model';

export class Car {
  public id: String;
  public licensePlate: String;
  public lastRefuel: Refuel;
  public stats: Stats;

  constructor(data: {
    id?: String,
    $key?: String,
    licensePlate: String,
    lastRefuel?: Refuel,
    stats?: Stats
  }) {
    this.id = 'id' in data ? data.id : data.$key;
    this.licensePlate = data.licensePlate;
    this.lastRefuel = data.lastRefuel;
    this.stats = data.stats ? new Stats(data.stats) : null;
  }
}
