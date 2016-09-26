import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import connect from './connect';
import { toList } from './utils';


function randomLicensePlate() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6;
  let s = '';
  for (let i = 0; i < length; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return s;
}

class CarList extends Component {
  static propTypes = {
    cars: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  createCar() {
    this.props.actions.createCar({ licensePlate: randomLicensePlate() })
      .then(car => console.log('created:', car));
  }

  deleteCar(id) {
    this.props.actions.deleteCar(id)
      .then(car => console.log('deleted:', id));
  }

  render() {
    const list = Object.keys(this.props.cars).length ? (
      <ul>
        {this.props.cars.map(car => (
          <li key={car.id}>
            <Link to={'/cars/' + car.id}>{car.licensePlate}</Link>
            <Button bsStyle='danger' onClick={this.deleteCar.bind(this, car.id)}>x</Button>
          </li>
        ))}
      </ul>
    ) : (
      <p><em>no cars yet</em></p>
    );

    return (
      <car-list>
        <h3>Cars</h3>
        <p>
          <Button onClick={this.createCar.bind(this)}>create car</Button>
        </p>
        {list}
      </car-list>
    );
  }
}

function mapStateToProps(state) {
  return {
    cars: toList(state.cars  || {}),
  };
}

export default connect(mapStateToProps, CarList);
