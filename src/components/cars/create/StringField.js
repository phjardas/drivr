import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';


class StringField extends Component {
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
      <FormGroup controlId={this.props.controlId} validationState={this.props.validation.state}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl required value={this.props.value} onChange={this.setValue} />
        <FormControl.Feedback />
        {this.props.validation.message && <HelpBlock>{this.props.validation.message}</HelpBlock>}
      </FormGroup>
    );
  }
}

StringField.propTypes = {
  controlId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  validation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StringField;
