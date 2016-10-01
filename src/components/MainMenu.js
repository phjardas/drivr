import React, { Component, PropTypes } from 'react';
import { Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { locales } from '../i18n';
import connect from './connect';
import { toList } from './utils';

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.actions.signOut()
      .then(() => this.context.router.push('/'));
  }

  setLocale(locale) {
    this.props.actions.setLocale(locale);
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
          <NavDropdown title={<Glyphicon glyph="globe" />} id="menu-lang">
            {toList(locales).map(lang => (
              <MenuItem
                  key={lang.id}
                  disabled={lang.id === this.props.locale}
                  onClick={this.setLocale.bind(this, lang.id)}>
                {lang.id === this.props.locale && '✓ '}{lang.label}
              </MenuItem>
            ))}
          </NavDropdown>
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
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
  actions: PropTypes.shape({
    signOut: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
};

MainMenu.contextTypes = {
  router: React.PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

function mapStateToProps({ auth, intl }) {
  return {
    user: auth.user,
    locale: intl.locale,
  };
}

export default connect(mapStateToProps, MainMenu);
