import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

import connect from '../../connect';
import { toList } from '../../utils';

class CarField extends Component {
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
    const car = this.props.cars[value];
    this.props.onChange({ value, validation, objectValue: car });
  }

  setValue(event) {
    this.setValueInternal(event.target.value);
  }

  render() {
    return (
      <FormGroup controlId="car" validationState={this.props.validation.state}>
        <ControlLabel>Car</ControlLabel>
        <FormControl componentClass="select" required value={this.props.value} onChange={this.setValue}>
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

CarField.propTypes = {
  value: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired,
  cars: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};


function mapStateToProps(state) {
  return {
    cars: state.cars  || {},
  };
}

export default connect(mapStateToProps, CarField);
