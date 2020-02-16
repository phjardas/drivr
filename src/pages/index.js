import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useAnalytics } from '../analytics';
import Loading from '../Loading';
import ProtectedRoute from '../ProtectedRoute';
import Redirect from '../Redirect';
import NotFound from './404';
import Cars from './cars';

const Invite = lazy(() => import('./invite'));
const SignIn = lazy(() => import('./signin'));

export default function Pages() {
  return (
    <Suspense fallback={<Loading layout={true} />}>
      <BrowserRouter>
        <Routes>
          <ProtectedRoute path="/cars/*" element={<Cars />} />
          <Route path="/invites/:carId/:inviteId" element={<Invite />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Redirect to="/cars" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Routes>
          <Route path="*" element={<AnalyticsRoute />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

function AnalyticsRoute() {
  const ga = useAnalytics();
  const location = useLocation();
  useEffect(() => {
    ga.pageview(location.pathname);
  }, [ga, location]);
  return null;
}
