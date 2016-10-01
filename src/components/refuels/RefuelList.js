import React, { Component, PropTypes } from 'react';
import { FormattedNumber, FormattedDate } from 'react-intl';
import decimal from 'decimal.js';

import connect from '../connect';
import { toList } from '../utils';


class RefuelList extends Component {
  componentWillMount() {
    this.props.actions.loadRefuels(this.props.car.id);
  }

  render() {
    const { car, refuels } = this.props;
    const carRefuels = toList(refuels[car.id] || {})
      .sort((a, b) => b.date.localeCompare(a.date));

    return (
      <refuel-list>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th className="number">Mileage (km)</th>
              <th className="number">Fuel amount (l)</th>
              <th className="number">Total price (€)</th>
              <th className="number">Price (€/l)</th>
              <th className="number">Distance (km)</th>
              <th className="number">Consumption (cl/km)</th>
            </tr>
          </thead>
          <tbody>
            {carRefuels.map(refuel => (
              <tr key={refuel.id}>
                <td>
                  <FormattedDate value={refuel.date} year="numeric" month="short" day="numeric" />
                </td>
                <td className="number">
                  <FormattedNumber value={refuel.mileage} />
                </td>
                <td className="number">
                  <FormattedNumber value={refuel.fuelAmount} minimumFractionDigits={2} maximumFractionDigits={2} />
                </td>
                <td className="number">
                  <FormattedNumber value={refuel.totalPrice} minimumFractionDigits={2} maximumFractionDigits={2} />
                </td>
                <td className="number">
                  <FormattedNumber value={decimal(refuel.pricePerLiter).toString()} minimumFractionDigits={3} maximumFractionDigits={3} />
                </td>
                <td className="number">
                  <FormattedNumber value={refuel.distance} />
                </td>
                <td className="number">
                  <FormattedNumber value={decimal(refuel.consumption).mul(decimal(100)).toString()} minimumFractionDigits={3} maximumFractionDigits={3} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </refuel-list>
    );
  }
}

RefuelList.propTypes = {
  actions: PropTypes.object.isRequired,
  car: PropTypes.object.isRequired,
  refuels: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    refuels: state.refuels || {},
  };
}

export default connect(mapStateToProps, RefuelList);
