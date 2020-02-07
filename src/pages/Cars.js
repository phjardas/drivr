import { List } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCars } from '../data';
import Fab from '../Fab';
import Layout from '../Layout';
import ListItemLink from '../ListItemLink';
import Loading from '../Loading';

export default function Cars() {
  const [cars, loading, error] = useCars();
  if (loading) return <Loading layout={true} />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout>
      <List>
        {cars.map((car) => (
          <ListItemLink
            key={car.id}
            to={`/cars/${car.id}`}
            primary={car.label}
            secondary={car.lastRefuel && <>Last refuel: {car.lastRefuel.mileage.toLocaleString()} km</>}
          />
        ))}
      </List>
      <Fab component={RouterLink} to="/cars/_new">
        <AddIcon />
      </Fab>
    </Layout>
  );
}
