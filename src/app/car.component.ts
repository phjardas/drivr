import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CarService, Car, Refuel } from './car.service';

@Component({
  selector: 'car',
  templateUrl: './car.component.html'
})
export class CarComponent implements OnInit {
  car: Observable<Car>;
  refuels: Observable<Refuel[]>;
  tabs = [
    { id: 'charts', label: 'Charts' },
    { id: 'table', label: 'Table' }
  ];
  activeTab = 'charts';

  mileageChartData = {
    chartType: 'LineChart',
    dataTable: null,
    options: {
      curveType: 'function',
      legend: 'none',
    },
  };

  consumptionChartData = {
    chartType: 'LineChart',
    dataTable: null,
    options: {
      curveType: 'function',
      legend: 'none',
    },
  };

  fuelPriceChartData = {
    chartType: 'LineChart',
    dataTable: null,
    options: {
      curveType: 'function',
      legend: 'none',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private carService: CarService) {
  }

  ngOnInit() {
    this.car = this.route.paramMap
      .switchMap(params => this.carService.getCar(params.get('id')));
    this.refuels = this.route.paramMap
      .switchMap(params => this.carService.getRefuels(params.get('id')))
      .map(refuels => refuels.sort((a, b) => b.date.getTime() - a.date.getTime()));

    this.refuels.subscribe(refuels => {
      this.updateMileageChart(refuels);
      this.updateConsumptionChart(refuels);
      this.updateFuelPriceChart(refuels);
    });
  }

  updateMileageChart(refuels: Refuel[]) {
    const header: any[] = ['Date', 'Mileage'];
    const data = refuels
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(refuel => [ refuel.date, refuel.mileage ]);
    this.mileageChartData = Object.assign({}, this.mileageChartData, { dataTable: [header].concat(data) });
  }

  updateConsumptionChart(refuels: Refuel[]) {
    const header: any[] = ['Date', 'Liters per 100km'];
    const data = refuels
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(refuel => [ refuel.date, refuel.consumption ]);
    this.consumptionChartData = Object.assign({}, this.consumptionChartData, { dataTable: [header].concat(data) });
  }

  updateFuelPriceChart(refuels: Refuel[]) {
    const header: any[] = ['Date', 'Fuel price'];
    const data = refuels
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(refuel => [ refuel.date, refuel.pricePerLiter ]);
    this.fuelPriceChartData = Object.assign({}, this.fuelPriceChartData, { dataTable: [header].concat(data) });
  }
}
