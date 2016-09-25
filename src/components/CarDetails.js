import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';

import connect from './connect';


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
          <h3>Car</h3>
          <p>
            <IndexLink to='/cars'>back to cars</IndexLink>
          </p>
          <dl>
            <dt>ID</dt>
            <dd>{carId}</dd>
            <dt>License plate</dt>
            <dd>{car.licensePlate}</dd>
          </dl>
        </car-details>
      );
    } else {
      return (
        <car-details>
          <h3>Car not found</h3>
        </car-details>
      );
    }
  }
}


function mapStateToProps(state) {
  return {
    cars: state.cars.cars  || {},
  };
}

export default connect(mapStateToProps, CarDetails);
