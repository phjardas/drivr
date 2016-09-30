import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';

import connect from '../../connect';
import { toList } from '../../utils';

class CarSelect extends Component {
  setValue(value) {
    const car = typeof value === 'string' ? this.props.cars[value] : value;
    this.props.onChange(car);
  }

  render() {
    const value = this.props.value;
    const car = typeof value === 'string' ? this.props.cars[value] : value;

    return (
      <FormControl
          componentClass="select"
          required={this.props.required}
          value={car ? car.id : ''}
          onChange={e => this.setValue(e.target.value)}
      >
        <option value={''} />
        {toList(this.props.cars).map(car => (
          <option key={car.id} value={car.id}>{car.licensePlate}</option>
        ))}
      </FormControl>
    );
  }
}

CarSelect.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  cars: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {
    cars: state.cars  || {},
  };
}

export default connect(mapStateToProps, CarSelect);
