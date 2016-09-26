import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

import connect from '../connect';
import RefuelList from '../refuels/RefuelList';


class CarDetails extends Component {
  render() {
    const { carId } = this.props.params;

    if (carId in this.props.cars) {
      const car = this.props.cars[carId];

      return (
        <car-details>
          <h1>Car</h1>
          <p>
            <IndexLink to="/cars">back to cars</IndexLink>
            {' | '}
            <Link to={{ pathname: '/refuels/_new', query: { carId: car.id }}}>create refuel</Link>
          </p>
          <dl className="dl-horizontal">
            <dt>ID</dt>
            <dd>{car.id}</dd>
            <dt>License plate</dt>
            <dd>{car.licensePlate}</dd>
            <dt>Initial mileage</dt>
            <dd>{car.initialMileage}</dd>
            {car.lastRefuel && <dt>Current mileage</dt>}
            {car.lastRefuel && <dd>{car.lastRefuel.mileage}</dd>}
            {car.lastRefuel && <dt>Last refuel</dt>}
            {car.lastRefuel && <dd>{car.lastRefuel.date}</dd>}
          </dl>
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
