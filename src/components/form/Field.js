import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

import Validator from './Validator';

function getValueFromEvent(e) {
  if (e && e.target && 'value' in e.target) {
    return e.target.value;
  }

  return e;
}

class Field extends Component {
  constructor(props) {
    super(props);
    const validators = [];
    if (this.props.model.required) validators.push(Validator.required);
    if (this.props.model.validators) validators.push(...this.props.model.validators);
    this.validate = Validator.all(validators);
  }

  componentWillMount() {
    setTimeout(() => this.setValue(this.props.value), 0);
  }

  setValue(value) {
    const validation = this.validate(value);
    this.props.onChange({ value, validation });
  }

  renderValidationMessages(help, messages) {
    const children = [];

    if (help) {
      children.push(<p key="help">{help}</p>);
    }

    if (messages && messages.length) {
      const msgs = messages.map((msg, i) => <p key={'msg-' + i}>{msg}</p>);
      children.push(...msgs);
    }

    if (children.length) {
      return <HelpBlock>{children}</HelpBlock>;
    }
  }

  render() {
    const { fieldId, model } = this.props;
    const value = typeof this.props.value !== 'undefined' ? this.props.value : '';
    const validation = this.props.validation || {};
    const control = this.props.model.control || <FormControl />;

    return (<form-field>
      <FormGroup controlId={fieldId} validationState={validation.state}>
        <ControlLabel>{model.label}</ControlLabel>

        {React.cloneElement(control, {
          required: model.required || false,
          value: value,
          onChange: e => this.setValue(getValueFromEvent(e)),
        })}

        <FormControl.Feedback />

        {this.renderValidationMessages(model.help, validation.messages)}
      </FormGroup>
    </form-field>);
  }
}

Field.propTypes = {
  fieldId: PropTypes.string.isRequired,
  model: PropTypes.shape({
    label: PropTypes.string.isRequired,
    help: PropTypes.string,
    required: PropTypes.bool,
    control: PropTypes.element,
    validators: PropTypes.arrayOf(PropTypes.func),
  }),
  value: PropTypes.any,
  validation: PropTypes.shape({
    state: PropTypes.oneOf([null, 'success', 'warning', 'error']),
    message: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

export default Field;
