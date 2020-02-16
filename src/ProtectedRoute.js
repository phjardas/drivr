import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth } from './auth';
import Redirect from './Redirect';

export default function ProtectedRoute({ rule, element, ...props }) {
  return <Route {...props} element={<ProtectedElement rule={rule} element={element} />} />;
}

function ProtectedElement({ rule, element }) {
  const { user } = useAuth();
  if (!user) return <Redirect to={`/signin?from=${encodeURIComponent(window.location.pathname)}`} />;
  if (rule && !rule(user)) return <Forbidden />;
  return element;
}

function Forbidden() {
  return <div>forbidden</div>;
}
