import qs from 'query-string';
import React, { useState } from 'react';
import MiniLayout from '../MiniLayout';
import Redirect from '../Redirect';
import SignIn from '../SignIn';

export default function SignInPage() {
  const [success, setSuccess] = useState(null);

  if (success) {
    const { from } = qs.parse(window.location.pathname);
    return <Redirect to={from || '/'} />;
  }

  return (
    <MiniLayout>
      <SignIn onSuccess={() => setSuccess(true)} />
    </MiniLayout>
  );
}
