import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';


import Field from './Field';
import Validator from './Validator';


class Form extends Component {
  constructor(props) {
    super(props);

    const fields = this.createFields(this.props.model.fields, this.props.value);

    this.state = {
      fields,
      validation: {},
    };

    this.submit = this.submit.bind(this);
  }

  createFields(model, value = {}) {
    const fields = {};
    for (let id in model) {
      fields[id] = {
        value: value[id],
        validation: {},
      };
    }
    return fields;
  }

  setValue(fieldId, { value, validation }) {
    const fields = Object.assign({}, this.state.fields, {
      [fieldId]: { value, validation }
    });

    const update = {
      fields,
      validation: Validator.combineValidations(Object.keys(fields).map(fieldId => fields[fieldId].validation)),
    };

    this.setState(update);
    typeof this.props.onChange === 'function' && this.props.onChange(this.getValues(fields));
  }

  submit(e) {
    e.preventDefault();
    this.props.onSubmit(this.getValues());
  }

  getValues(fields = this.state.fields) {
    const values = {};
    Object.keys(fields)
      .filter(fieldId => fields[fieldId].validation.state !== 'error')
      .forEach(fieldId => values[fieldId] = fields[fieldId].value);
    return values;
  }

  renderFields() {
    return (<form-fields>{
      Object.keys(this.props.model.fields).map(this.renderField.bind(this))
    }</form-fields>);
  }

  renderField(fieldId) {
    const model = this.props.model.fields[fieldId];
    const fieldState = this.state.fields[fieldId];

    return (
      <Field
        key={fieldId}
        fieldId={fieldId}
        model={model}
        value={fieldState.value}
        validation={fieldState.validation}
        onChange={this.setValue.bind(this, fieldId)}
      />
    );
  }

  renderActions() {
    return (<form-actions>
      <Button type="submit" bsStyle="primary" disabled={this.state.validation.state === 'error'}>
        {this.props.submitButtonLabel || 'Submit'}
      </Button>
    </form-actions>);
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        {this.renderFields()}
        {this.renderActions()}
      </form>
    );
  }
}

Form.propTypes = {
  model: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }).isRequired,
  value: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  submitButtonLabel: PropTypes.string,
};

export default Form;
