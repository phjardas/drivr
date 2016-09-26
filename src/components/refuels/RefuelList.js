import React, { Component, PropTypes } from 'react';

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
                <td>{refuel.date}</td>
                <td className="number">{refuel.mileage}</td>
                <td className="number">{refuel.fuelAmount}</td>
                <td className="number">{refuel.totalPrice}</td>
                <td className="number">{refuel.pricePerLiter}</td>
                <td className="number">{refuel.distance}</td>
                <td className="number">{refuel.consumption * 100}</td>
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
