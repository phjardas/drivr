import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { defineMessages, FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import { Table, Button, Glyphicon } from 'react-bootstrap';

import connect from '../connect';
import { toList } from '../utils';

const messages = defineMessages({
  title: {
    id: 'carList.title',
  },
  createCarButton: {
    id: 'carList.createCar.buttonLabel',
  },
});

class CarList extends Component {
  render() {
    return (
      <car-list>
        <h1><FormattedMessage {...messages.title} /></h1>
        <p>
          <LinkContainer to="/cars/_new">
            <Button bsStyle="primary">
              <Glyphicon glyph="plus" />
              {' '}
              <FormattedMessage {...messages.createCarButton} />
            </Button>
          </LinkContainer>
        </p>
        {this.props.cars.length ? (
          <Table>
            <thead>
              <tr>
                <th>License plate</th>
                <th className="number">Mileage</th>
                <th>Last refuel</th>
              </tr>
            </thead>
            <tbody>
              {this.props.cars.map(car => (
                <tr key={car.id}>
                  <td>
                    <Link to={'/cars/' + car.id}>{car.licensePlate}</Link>
                  </td>
                  <td className="number">
                    <FormattedNumber value={car.stats ? car.stats.totalDistance : car.initialMileage} /> km
                  </td>
                  <td>
                    {car.lastRefuel ? <FormattedDate value={car.lastRefuel.date} year="numeric" month="short" day="numeric" /> : <em>never</em>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p><em>no cars yet</em></p>
        )}
      </car-list>
    );
  }
}

CarList.propTypes = {
  cars: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    cars: toList(state.cars  || {}),
  };
}

export default connect(mapStateToProps, CarList);
