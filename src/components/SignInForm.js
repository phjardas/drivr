import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import { AuthenticationMethods } from '../actions/auth';
import connect from './connect';
import { toList } from './utils';

class SignInForm extends Component {
  signIn(method) {
    this.props.actions.signIn(method)
      .then(() => this.context.router.push('/cars/'));
  }

  render() {
    return (
      <ButtonGroup>
        {toList(AuthenticationMethods).map(method => (
          <Button key={method.id} onClick={this.signIn.bind(this, method.id)} bsSize="large">
            <img src={method.iconUrl} />
            {' '}
            {method.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}

SignInForm.propTypes = {
  actions: PropTypes.shape({
    signIn: PropTypes.func.isRequired,
  }).isRequired,
};

SignInForm.contextTypes = {
  router: React.PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default connect(() => ({}), SignInForm);
