import { BottomNavigation } from '@material-ui/core';
import { DirectionsCar as OverviewIcon, LocalGasStation as RefuelIcon } from '@material-ui/icons';
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import BottomNavigationLink from '../../../BottomNavigationLink';

function CarNav(props) {
  const params = useParams();

  return (
    <BottomNavigation showLabels value={params.tab} {...props}>
      <BottomNavigationLink value="overview" label="Overview" icon={<OverviewIcon />} to={`/cars/${params.id}/overview`} />
      <BottomNavigationLink value="refuels" label="Refuels" icon={<RefuelIcon />} to={`/cars/${params.id}/refuels`} />
    </BottomNavigation>
  );
}

export default function CarNavWrapper(props) {
  return (
    <Routes>
      <Route path=":tab" element={<CarNav {...props} />} />
    </Routes>
  );
}
