import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import connect from '../../connect';
import { toList } from '../../utils';

import MileageField from '../../refuels/create/MileageField';
import StringField from './StringField';


function validationPriority(value) {
  if (!value) return 0;
  switch(value) {
    case 'success': return 0;
    case 'warning': return 1;
    case 'error': return 2;
  }
}


class CreateCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        licensePlate: {
          value: '',
          validation: {},
        },
        initialMileage: {
          value: '',
          validation: {},
        },
      },
      validation: {},
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

  submit(event) {
    event.preventDefault();
    this.setState({ submitting: true });

    const fields = this.state.fields;
    this.props.actions.createCar({
      licensePlate: fields.licensePlate.value,
      initialMileage: fields.initialMileage.value,
    }).then(car => {
      this.setState({ submitting: null });
      this.context.router.push('/cars/' + car.id);
    });
  }

  render() {
    const fields = this.state.fields;

    return (
      <create-car>
        <h1>Create Car</h1>
        <form onSubmit={this.submit}>
          <StringField
            controlId="licensePlate"
            label="License plate"
            value={fields.licensePlate.value}
            validation={fields.licensePlate.validation}
            onChange={this.setValue.bind(this, 'licensePlate')} />

          <MileageField
            controlId="initialMileage"
            label="Initial mileage (km)"
            value={fields.initialMileage.value}
            validation={fields.initialMileage.validation}
            onChange={this.setValue.bind(this, 'initialMileage')} />

          <Button type="submit" disabled={this.state.submitting || this.state.validation.state === 'error'}>
            Create car
          </Button>

          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </form>
      </create-car>
    );
  }
}

CreateCar.propTypes = {
  actions: PropTypes.object.isRequired,
};

CreateCar.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(() => ({}), CreateCar);
