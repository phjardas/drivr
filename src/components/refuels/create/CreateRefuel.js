import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import decimal from 'decimal.js';
import { fromJS } from 'immutable';

import connect from '../../connect';
import { toDateString, toTimeString } from '../../utils';
import { Refuel } from '../../../model/refuel';
import Form from '../../form/Form';
import CarSelect from './CarSelect';

function calculateDependants(values) {
  const refuel =  new Refuel(values, values.car).toJS();

  return {
    distance: refuel.distance,
    pricePerLiter: refuel.pricePerLiter && decimal(refuel.pricePerLiter),
    consumption: refuel.consumption && decimal(refuel.consumption).mul(decimal(100)),
  };
}

class CreateRefuel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model: {
        fields: {
          car: {
            label: 'Car',
            required: true,
            control: <CarSelect />,
          },
          date: {
            label: 'Date',
            required: true,
            control: <FormControl type="date" />,
          },
          time: {
            label: 'Time',
            required: true,
            control: <FormControl type="time" />,
          },
          mileage: {
            label: 'Mileage',
            required: true,
            control: <FormControl type="number" min={0} />,
          },
          fuelAmount: {
            label: 'Fuel amount',
            required: true,
          },
          totalPrice: {
            label: 'Total price',
            required: true,
          },
        },
      },
    };

    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
  }

  update(values) {
    const deps = calculateDependants(values);
    const model = fromJS(this.state.model)
      .setIn(['fields', 'mileage', 'help'], deps.distance && 'Distance: ' + deps.distance + ' km')
      .setIn(['fields', 'totalPrice', 'help'], deps.pricePerLiter && 'Price: ' + deps.pricePerLiter.toFixed(3) + ' €/l')
      .setIn(['fields', 'fuelAmount', 'help'], deps.consumption && 'Consumption: ' + deps.consumption.toFixed(2) + ' l/100 km')
      .toJS();
    this.setState({ model });
  }

  submit(values) {
    const ref = {
      carId: values.car.id,
      date: values.date + 'T' + values.time,
      mileage: values.mileage,
      fuelAmount: values.fuelAmount,
      totalPrice: values.totalPrice,
    };

    this.props.actions.createRefuel(ref)
      .then(() => this.context.router.push('/cars/' + values.car.id));
  }

  render() {
    const now = new Date();
    const carId = this.props.location.query ? this.props.location.query.carId : '';
    const value = {
      car: carId,
      date: toDateString(now),
      time: toTimeString(now, false),
    };

    return (
      <create-car>
        <h1>Create Refuel</h1>
        <Form
          model={this.state.model}
          value={value}
          onSubmit={this.submit}
          onChange={this.update}
          submitButtonLabel="Create refuel"
        />
      </create-car>
    );
  }
}

CreateRefuel.propTypes = {
  actions: PropTypes.shape({
    createRefuel: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
};

CreateRefuel.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(() => ({}), CreateRefuel);
