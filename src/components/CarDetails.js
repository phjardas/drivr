import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

import connect from './connect';
import RefuelList from './refuels/RefuelList';


class CarDetails extends Component {
  static propTypes = {
    cars: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  }

  render() {
    const { carId } = this.props.params;

    if (carId in this.props.cars) {
      const car = this.props.cars[carId];

      return (
        <car-details>
          <h1>Car</h1>
          <p>
            <IndexLink to='/cars'>back to cars</IndexLink>
            {' | '}
            <Link to={'/refuels/_new?carId=' + car.id}>create refuel</Link>
          </p>
          <dl>
            <dt>ID</dt>
            <dd>{car.id}</dd>
            <dt>License plate</dt>
            <dd>{car.licensePlate}</dd>
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


function mapStateToProps(state) {
  return {
    cars: state.cars  || {},
  };
}

export default connect(mapStateToProps, CarDetails);
