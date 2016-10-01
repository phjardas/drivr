import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedNumber } from 'react-intl';
import { Table } from 'react-bootstrap';

import connect from '../connect';
import { toList } from '../utils';


class CarList extends Component {
  render() {
    return (
      <car-list>
        <h1>Cars</h1>
        <p>
          <Link to="/cars/_new">create car</Link>
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
                    {car.lastRefuel ? car.lastRefuel.date : <em>never</em>}
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
