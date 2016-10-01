import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { FormControl } from 'react-bootstrap';

import connect from '../../connect';
import Form from '../../form/Form';

class CreateCar extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    this.props.actions.createCar(values)
      .then(car => this.context.router.push('/cars/' + car.id));
  }

  render() {
    const model = {
      fields: {
        licensePlate: {
          label: 'License plate',
          required: true,
          validators: [
            value => value && value.length < 5 && { state: 'warning', message: <FormattedMessage id="error.stringTooShort" values={{ min: 5 }} /> },
            value => value && value.length > 100 && { state: 'warning', message: <FormattedMessage id="error.stringTooLong" values={{ max: 100 }} /> },
          ],
        },
        initialMileage: {
          label: 'Initial mileage',
          required: true,
          control: <FormControl type="number" min={0} />,
        },
      },
    };

    const value = {};

    return (
      <create-car>
        <h1>Create Car</h1>
        <Form
          model={model}
          value={value}
          onSubmit={this.submit}
          submitButtonLabel="Create car"
        />
      </create-car>
    );
  }
}

CreateCar.propTypes = {
  actions: PropTypes.shape({
    createCar: PropTypes.func.isRequired,
  }).isRequired,
};

CreateCar.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(() => ({}), CreateCar);
