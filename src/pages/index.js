import React from 'react';
import { BrowserRouter, Redirect, Route, Routes } from 'react-router-dom';
import Car from './Car';
import Cars from './Cars';
import NewRefuel from './NewRefuel';

export default function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<Car />} />
        <Route path="/cars/:id/refuels/_new" element={<NewRefuel />} />
        <Route path="/" element={<Redirect to="/cars" />} />
      </Routes>
    </BrowserRouter>
  );
}
