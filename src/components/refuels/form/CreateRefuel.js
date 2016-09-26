import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import decimal from 'decimal.js';

import connect from '../../connect';
import { toList, toDateString, toTimeString } from '../../utils';

import CarIdField from './CarIdField';
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
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const now = new Date();

    this.state = {
      fields: {
        carId: {
          value: '',
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

  setValue(key, { value, validation, }) {
    const fields = Object.assign({}, this.state.fields, {
      [key]: { value, validation, },
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
      .filter(f => f.$key !== updatedField)
      .map(f => f.validation.state);
    validations.push(updatedValidationState);
    return validations.sort((a, b) => validationPriority(b) - validationPriority(a))[0];
  }

  getValidFieldValue(key, fields = this.state.fields) {
    const field = fields[key];
    return isValid(field) ? field.value : null;
  }

  calculateDependents(fields) {
    const dependents = {};

    try {
      const price = decimal(this.getValidFieldValue('totalPrice', fields));
      const liters = decimal(this.getValidFieldValue('fuelAmount', fields));
      if (liters.greaterThan(decimal(0))) {
        dependents.pricePerLiter = price.div(liters).toFixed(3);
      }
    } catch(e) {
    }

    return dependents;
  }

  submit(event) {
    event.preventDefault();
    this.setState({ submitting: true });

    const fields = this.state.fields;
    this.props.actions.createRefuel({
      carId: fields.carId.value,
      date: fields.date.value + 'T' + fields.time.value,
      mileage: fields.mileage.value,
      fuelAmount: fields.fuelAmount.value,
      totalPrice: fields.totalPrice. value,
    }).then(res => {
      console.log('saved:', res);
      this.setState({ submitting: null });
    });
  }

  render() {
    const fields = this.state.fields;

    return (
      <create-refuel>
        <h1>Create Refuel</h1>
        <form onSubmit={this.submit}>
          <CarIdField value={fields.carId.value}
                      validation={fields.carId.validation}
                      onChange={this.setValue.bind(this, 'carId')} />

          <DateField value={fields.date.value}
                      validation={fields.date.validation}
                      onChange={this.setValue.bind(this, 'date')} />

          <TimeField value={fields.time.value}
                      validation={fields.time.validation}
                      onChange={this.setValue.bind(this, 'time')} />

          <MileageField value={fields.mileage.value}
                      validation={fields.mileage.validation}
                      onChange={this.setValue.bind(this, 'mileage')} />

          <FuelAmountField value={fields.fuelAmount.value}
                      validation={fields.fuelAmount.validation}
                      onChange={this.setValue.bind(this, 'fuelAmount')} />

          <TotalPriceField value={fields.totalPrice.value}
                      validation={fields.totalPrice.validation}
                      onChange={this.setValue.bind(this, 'totalPrice')} />

          {this.state.dependents.pricePerLiter && (<FormGroup>
            <ControlLabel>Price per volume</ControlLabel>
            <FormControl.Static>{this.state.dependents.pricePerLiter} €/l</FormControl.Static>
          </FormGroup>)}

          <Button type='submit' disabled={this.state.submitting || this.state.validation.state === 'error'}>Create refuel</Button>

          <pre className='hidden'>{JSON.stringify(this.state, null, 2)}</pre>

        </form>
      </create-refuel>
    );
  }
}

export default connect(state => ({}), CreateRefuel);
