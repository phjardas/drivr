import { List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import Layout from '../Layout';
import Loading from '../Loading';

export default function Cars() {
  const [user] = useAuthState(auth);
  const [cars, loading, error] = useCollectionData(firestore.collection('cars').where(`users.${user.uid}`, '==', true), { idField: 'id' });

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
    </Layout>
  );
}
