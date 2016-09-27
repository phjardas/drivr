import React, { Component, PropTypes } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';

import SignInForm from './SignInForm';
import connect from './connect';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.actions.signOut()
      .then(() => this.context.router.push('/'));
  }

  render() {
    if (this.props.user) {
      return (
        <Jumbotron>
          <h1>Hey, {this.props.user.displayName}!</h1>
          <p>Good to have you here; you are already signed in.</p>
          <p>
            <Button onClick={this.signOut}
                bsStyle="primary"
                bsSize="large">
              Sign out
            </Button>
          </p>
        </Jumbotron>
      );
    }

    return (
      <sign-in>
        <Jumbotron>
          <h1>Sign in or register</h1>
          <p>Sign in or register for free with one of the methods below.</p>
          <SignInForm />
        </Jumbotron>
      </sign-in>
    );
  }
}

SignIn.propTypes = {
  user: PropTypes.object,
  actions: PropTypes.object.isRequired,
};

SignIn.contextTypes = {
  router: React.PropTypes.object,
};

function mapStateToProps({ auth }) {
  return {
    user: auth.user,
  };
}

export default connect(mapStateToProps, SignIn);
