import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Glyphicon } from 'react-bootstrap';

import connect from '../connect';
import { toList } from '../utils';


class CarList extends Component {
  static propTypes = {
    cars: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  deleteCar(id) {
    this.props.actions.deleteCar(id)
      .then(car => console.log('deleted:', id));
  }

  render() {
    const list = this.props.cars.length ? (
      <ul>
        {this.props.cars.map(car => (
          <li key={car.id}>
            <Link to={'/cars/' + car.id}>{car.licensePlate}</Link>
            {' '}
            <Button bsStyle="danger" bsSize="xsmall" onClick={this.deleteCar.bind(this, car.id)}>
              <Glyphicon glyph="trash" />
            </Button>
          </li>
        ))}
      </ul>
    ) : (
      <p><em>no cars yet</em></p>
    );

    return (
      <car-list>
        <h1>Cars</h1>
        <p>
          <Link to="/cars/_new">create car</Link>
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
