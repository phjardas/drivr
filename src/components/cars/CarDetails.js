import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { FormattedNumber } from 'react-intl';
import decimal from 'decimal.js';

import connect from '../connect';
import RefuelList from '../refuels/RefuelList';


class CarDetails extends Component {
  render() {
    const { carId } = this.props.params;

    if (carId in this.props.cars) {
      const car = this.props.cars[carId];

      return (
        <car-details>
          <h1>Car {car.licensePlate}</h1>
          <p>
            <IndexLink to="/cars">back to cars</IndexLink>
            {' | '}
            <Link to={{ pathname: '/refuels/_new', query: { carId: car.id }}}>create refuel</Link>
          </p>

          {car.stats && (
            <div>
              <h2>Statistics</h2>
              <dl className="dl-horizontal">
                <dt>Total distance</dt>
                <dd><FormattedNumber value={car.stats.totalDistance} /> km</dd>
                <dt>Refuels</dt>
                <dd><FormattedNumber value={car.stats.refuelCount} /></dd>
                <dt>Total fuel</dt>
                <dd><FormattedNumber value={decimal(car.stats.totalFuel).toString()} minimumFractionDigits={2} maximumFractionDigits={2} /> l</dd>
                <dt>Total money</dt>
                <dd><FormattedNumber value={decimal(car.stats.totalPrice).toString()} minimumFractionDigits={2} maximumFractionDigits={2} /> €</dd>
                <dt>Average consumption</dt>
                <dd><FormattedNumber value={decimal(car.stats.averageConsumption).mul(decimal(100)).toString()} minimumFractionDigits={2} maximumFractionDigits={2} /> l/100 km</dd>
                <dt>Average money</dt>
                <dd><FormattedNumber value={decimal(car.stats.averagePricePerDistance).mul(decimal(100)).toString()} minimumFractionDigits={2} maximumFractionDigits={2} /> €/100 km</dd>
                <dt>Average price</dt>
                <dd><FormattedNumber value={decimal(car.stats.averagePricePerVolume).toString()} minimumFractionDigits={3} maximumFractionDigits={3} /> €/l</dd>
              </dl>
            </div>
          )}
          <h2>Refuels</h2>
          <RefuelList car={car} />
        </car-details>
      );
    } else {
      return (
        <car-details>
          <h1>Car not found</h1>
        </car-details>
      );
    }
  }
}

CarDetails.propTypes = {
  params: PropTypes.object.isRequired,
  cars: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {
    cars: state.cars  || {},
  };
}

export default connect(mapStateToProps, CarDetails);
