import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

import connect from '../../connect';
import { toList } from '../../utils';

class CarIdField extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    validation: PropTypes.object.isRequired,
    cars: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    this.setValueInternal(this.props.value);
  }

  validate(value) {
    return value ? {} : { state: 'error', message: 'required' };
  }

  setValueInternal(value) {
    const validation = this.validate(value);
    this.props.onChange({ value, validation });
  }

  setValue(event) {
    this.setValueInternal(event.target.value);
  }

  render() {
    return (
      <FormGroup controlId='carId' validationState={this.props.validation.state}>
        <ControlLabel>Car</ControlLabel>
        <FormControl componentClass='select' required value={this.props.value} onChange={this.setValue}>
          <option value={''}>[ please select a car ]</option>
          {toList(this.props.cars).map(car => (
            <option key={car.id} value={car.id}>{car.licensePlate}</option>
          ))}
        </FormControl>
        <FormControl.Feedback />
        {this.props.validation.message && <HelpBlock>{this.props.validation.message}</HelpBlock>}
      </FormGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    cars: state.cars  || {},
  };
}

export default connect(mapStateToProps, CarIdField);
