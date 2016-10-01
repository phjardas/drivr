import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Jumbotron } from 'react-bootstrap';

import SignInForm from './SignInForm';

const messages = defineMessages({
    title: {
        id: 'home.title',
        description: 'Big title on the homepage',
    },
});

function HomePage() {
  return (
    <home>
      <Jumbotron>
        <h1><FormattedMessage {...messages.title} /></h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Vestibulum quis mattis enim, sit amet blandit justo. Morbi dictum sem vel purus elementum, a ullamcorper ipsum rhoncus. Ut nunc augue, molestie id blandit vitae, pretium at massa. Vivamus malesuada aliquet tellus, vitae convallis enim efficitur sed. Aliquam tristique sapien in lorem dictum finibus.</p>
      </Jumbotron>

      <h2>Sign in or register now <small>It's free!</small></h2>
      <SignInForm />
    </home>
  );
}

export default HomePage;
