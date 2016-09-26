import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

import connect from '../connect';
import { toList } from '../utils';
import { Refuel } from '../../model/refuel';


class RefuelList extends Component {
  static propTypes = {
    car: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.actions.loadRefuels(this.props.car.id);
  }

  render() {
    const { car, refuels } = this.props;
    const carRefuels = toList(refuels[car.id] || {}).map(r => new Refuel(r));

    return (
      <refuel-list>
        <table className='table'>
          <thead>
            <tr>
              <th>Date</th>
              <th className='number'>Mileage (km)</th>
              <th className='number'>Fuel amount (l)</th>
              <th className='number'>Total price (€)</th>
              <th className='number'>Price (€/l)</th>
            </tr>
          </thead>
          <tbody>
            {carRefuels.map(refuel => (
              <tr key={refuel.id}>
                <td>{refuel.date}</td>
                <td className='number'>{refuel.mileage}</td>
                <td className='number'>{refuel.fuelAmount.toFixed(2)}</td>
                <td className='number'>{refuel.totalPrice.toFixed(2)}</td>
                <td className='number'>{refuel.pricePerLiter.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </refuel-list>
    );
  }
}

function mapStateToProps(state) {
  return {
    refuels: state.refuels || {},
  };
}

export default connect(mapStateToProps, RefuelList);
