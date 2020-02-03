import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Loading from '../Loading';

const Car = lazy(() => import('./Car'));
const Cars = lazy(() => import('./Cars'));

export default function Pages() {
  return (
    <Suspense fallback={<Loading layout={true} />}>
      <BrowserRouter>
        <Routes>
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id/*" element={<Car />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

function Home() {
  const navigate = useNavigate();
  useEffect(() => navigate('/cars'), [navigate]);
  return null;
}
