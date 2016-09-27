import React, { Component, PropTypes } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import connect from './connect';

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.actions.signOut()
      .then(() => this.context.router.push('/'));
  }

  renderAuthenticated(user) {
    return (
      <main-menu>
        <Nav>
          <LinkContainer to="/cars">
            <NavItem>Cars</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          <NavDropdown title={<span><Glyphicon glyph="user" /> {user.displayName}</span>} id="menu-user">
            <MenuItem onClick={this.signOut}>Sign out</MenuItem>
          </NavDropdown>
        </Nav>
      </main-menu>
    );
  }

  renderAnonymous() {
    return (
      <main-menu>
        <Nav pullRight>
          <LinkContainer to="/signin">
            <NavItem>Sign in</NavItem>
          </LinkContainer>
        </Nav>
      </main-menu>
    );
  }

  render() {
    return this.props.user ? this.renderAuthenticated(this.props.user) : this.renderAnonymous();
  }
}

MainMenu.propTypes = {
  user: PropTypes.object,
  actions: PropTypes.object.isRequired,
};

MainMenu.contextTypes = {
  router: React.PropTypes.object,
};

function mapStateToProps({ auth }) {
  return {
    user: auth.user,
  };
}

export default connect(mapStateToProps, MainMenu);
