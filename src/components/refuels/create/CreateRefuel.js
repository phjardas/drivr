import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import decimal from 'decimal.js';

import connect from '../../connect';
import { toList, toDateString, toTimeString } from '../../utils';

import { Refuel } from '../../../model/refuel';

import CarField from './CarField';
import DateField from './DateField';
import TimeField from './TimeField';
import MileageField from './MileageField';
import FuelAmountField from './FuelAmountField';
import TotalPriceField from './TotalPriceField';


function validationPriority(value) {
  if (!value) return 0;
  switch(value) {
    case 'success': return 0;
    case 'warning': return 1;
    case 'error': return 2;
  }
}

function isValid(field) {
  return !field.validation.state || field.validation.state === 'success';
}


class CreateRefuel extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    const carId = props.location.query ? props.location.query.carId : '';

    this.state = {
      fields: {
        car: {
          value: carId,
          validation: {},
        },
        date: {
          value: toDateString(now),
          validation: {},
        },
        time: {
          value: toTimeString(now, false),
          validation: {},
        },
        mileage: {
          value: '',
          validation: {},
        },
        fuelAmount: {
          value: '',
          validation: {},
        },
        totalPrice: {
          value: '',
          validation: {},
        },
      },
      validation: {},
      dependents: {},
    };

    this.submit = this.submit.bind(this);
  }

  setValue(key, { value, validation, objectValue }) {
    const fields = Object.assign({}, this.state.fields, {
      [key]: { value, validation, objectValue },
    });

    const update = {
      fields: fields,
      validation: {
        state: this.getFormValidationState(key, validation.state),
      },
      dependents: this.calculateDependents(fields),
    };

    this.setState(update);
  }

  getFormValidationState(updatedField, updatedValidationState) {
    const validations = toList(this.state.fields)
      .filter(f => f.id !== updatedField)
      .map(f => f.validation.state);
    validations.push(updatedValidationState);
    return validations.sort((a, b) => validationPriority(b) - validationPriority(a))[0];
  }

  getValidFieldValue(key, fields = this.state.fields) {
    const field = fields[key];
    return isValid(field) ? field.value : null;
  }

  calculateDependents(fields) {
    const values = {};
    ['date', 'mileage', 'fuelAmount', 'totalPrice'].forEach(field => {
      values[field] = this.getValidFieldValue(field, fields);
    });
    const car = isValid(fields.car) ? fields.car.objectValue : null;
    return new Refuel(values, car).toJS();
  }

  submit(event) {
    event.preventDefault();

    const fields = this.state.fields;
    const ref = {
      carId: fields.car.value,
      date: fields.date.value + 'T' + fields.time.value,
      mileage: fields.mileage.value,
      fuelAmount: fields.fuelAmount.value,
      totalPrice: fields.totalPrice. value,
    };

    this.props.actions.createRefuel(ref)
      .then(() => this.context.router.push('/cars/' + fields.car.value));
  }

  render() {
    const fields = this.state.fields;

    return (
      <create-refuel>
        <h1>Create Refuel</h1>
        <form onSubmit={this.submit}>
          <CarField value={fields.car.value}
            validation={fields.car.validation}
            onChange={this.setValue.bind(this, 'car')} />

          <DateField value={fields.date.value}
            validation={fields.date.validation}
            onChange={this.setValue.bind(this, 'date')} />

          <TimeField value={fields.time.value}
            validation={fields.time.validation}
            onChange={this.setValue.bind(this, 'time')} />

          <MileageField controlId="mileage"
            label="Mileage (km)"
            value={fields.mileage.value}
            validation={fields.mileage.validation}
            onChange={this.setValue.bind(this, 'mileage')} />

          <FuelAmountField value={fields.fuelAmount.value}
            validation={fields.fuelAmount.validation}
            onChange={this.setValue.bind(this, 'fuelAmount')} />

          <TotalPriceField value={fields.totalPrice.value}
            validation={fields.totalPrice.validation}
            onChange={this.setValue.bind(this, 'totalPrice')} />

          {this.state.dependents.distance && (<FormGroup>
            <ControlLabel>Distance</ControlLabel>
            <FormControl.Static>{this.state.dependents.distance} km</FormControl.Static>
          </FormGroup>)}

          {this.state.dependents.pricePerLiter && (<FormGroup>
            <ControlLabel>Price per volume</ControlLabel>
            <FormControl.Static>{decimal(this.state.dependents.pricePerLiter).toFixed(3)} €/l</FormControl.Static>
          </FormGroup>)}

          {this.state.dependents.consumption && (<FormGroup>
            <ControlLabel>Consumption</ControlLabel>
            <FormControl.Static>{decimal(this.state.dependents.consumption).mul(decimal(100)).toFixed(3)} l/100 km</FormControl.Static>
          </FormGroup>)}

          <Button type="submit" disabled={this.state.validation.state === 'error'}>Create refuel</Button>

          <pre>{JSON.stringify(this.state, null, 2)}</pre>

        </form>
      </create-refuel>
    );
  }
}

CreateRefuel.propTypes = {
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

CreateRefuel.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(() => ({}), CreateRefuel);
