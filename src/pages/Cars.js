import { List, ListItem, ListItemText } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '../data';
import Fab from '../Fab';
import Layout from '../Layout';
import Loading from '../Loading';

export default function Cars() {
  const [cars, loading, error] = useCars();
  if (loading) return <Loading layout={true} />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout>
      <List>
        {cars.map((car) => (
          <ListItem key={car.id} component={Link} to={`/cars/${car.id}`}>
            <ListItemText primary={car.label} secondary={car.lastRefuel && <>Last refuel: {car.lastRefuel.mileage.toLocaleString()} km</>} />
          </ListItem>
        ))}
      </List>
      <Fab component={Link} to="/cars/_new">
        <AddIcon />
      </Fab>
    </Layout>
  );
}
