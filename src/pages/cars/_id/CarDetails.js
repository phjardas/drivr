import { Container, makeStyles } from '@material-ui/core';
import { LocalGasStation as RefuelIcon } from '@material-ui/icons';
import React, { lazy } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import CacheWarning from '../../../CacheWarning';
import Fab from '../../../Fab';
import Layout from '../../../Layout';
import Redirect from '../../../Redirect';
import CarNav from './CarNav';

const CarCharts = lazy(() => import('./CarCharts'));
const CarOverview = lazy(() => import('./CarOverview'));
const CarRefuels = lazy(() => import('./CarRefuels'));

const useStyles = makeStyles(({ spacing }) => ({
  content: {
    marginBottom: 56 + spacing(2),
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fab: {
    bottom: 56 + spacing(2),
  },
}));

export default function CarDetails({ car }) {
  const classes = useStyles();

  return (
    <Layout title={car.label} back="/cars" gutter>
      {car._cached && (
        <Container>
          <CacheWarning />
        </Container>
      )}
      <Container className={classes.content}>
        <Routes>
          <Route path="overview" element={<CarOverview car={car} />} />
          <Route path="refuels" element={<CarRefuels car={car} />} />
          <Route path="charts" element={<CarCharts car={car} />} />
          <Route path="*" element={<Redirect to="overview" />} />
        </Routes>
      </Container>
      {car.stats && car.stats.refuelCount > 0 && <CarNav key="nav" className={classes.nav} />}
      <Fab key="fab" component={Link} to="refuels/_new" className={classes.fab}>
        <RefuelIcon />
      </Fab>
    </Layout>
  );
}
