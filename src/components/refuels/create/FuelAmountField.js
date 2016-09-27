import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import decimal from 'decimal.js';


class FuelAmountField extends Component {
  constructor(props) {
    super(props);
    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    this.setValueInternal(this.props.value);
  }

  validate(value) {
    if (!value) return { state: 'error', message: 'required' };

    try {
      decimal(value);
      return {};
    } catch (e) {
      return { state: 'error', message: 'format' };
    }
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
      <FormGroup controlId="fuelAmount" validationState={this.props.validation.state}>
        <ControlLabel>Fuel amount (liters)</ControlLabel>
        <FormControl required value={this.props.value} onChange={this.setValue} />
        <FormControl.Feedback />
        {this.props.validation.message && <HelpBlock>{this.props.validation.message}</HelpBlock>}
      </FormGroup>
    );
  }
}

FuelAmountField.propTypes = {
  value: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FuelAmountField;
