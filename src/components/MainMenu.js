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

  setLocale(locale) {
    this.props.actions.setLocale(locale);
  }

  renderAuthenticated(user) {
    const languages = [
      { locale: 'en', label: 'English' },
      { locale: 'de', label: 'Deutsch' },
    ];

    return (
      <main-menu>
        <Nav>
          <LinkContainer to="/cars">
            <NavItem>Cars</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          <NavDropdown title="Language" id="menu-lang">
            {languages.map(lang => (
              <MenuItem
                  key={lang.locale}
                  onClick={this.setLocale.bind(this, lang.locale)}>
                {this.props.locale === lang.locale && '✓ '}{lang.label}
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
  }).isRequired,
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
