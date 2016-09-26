import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';


class MileageField extends Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    validation: PropTypes.object.isRequired,
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
      <FormGroup controlId='mileage' validationState={this.props.validation.state}>
        <ControlLabel>Mileage (km)</ControlLabel>
        <FormControl type='number' min={0} required value={this.props.value} onChange={this.setValue} />
        <FormControl.Feedback />
        {this.props.validation.message && <HelpBlock>{this.props.validation.message}</HelpBlock>}
      </FormGroup>
    );
  }
}

export default MileageField;
