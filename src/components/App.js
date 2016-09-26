import React, { PropTypes } from 'react';
import { Navbar } from 'react-bootstrap';
import { IndexLink } from 'react-router';

const App = (props) => {
  return (
    <drivr>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/" className="navbar-brand">drivr</IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
      <div className="container">
        {props.children}
      </div>
    </drivr>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
