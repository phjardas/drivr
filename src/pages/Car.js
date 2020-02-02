import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import Layout from '../Layout';
import Loading from '../Loading';

export default function Car() {
  const { id } = useParams();
  const [car, loading, error] = useDocumentData(firestore.collection('cars').doc(id), { idField: 'id' });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout title={car.label} back="/cars">
      <Grid container spacing={8}>
        {car.lastRefuel && (
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Last Refuel
                </Typography>
                <Typography>Date: {new Date(car.lastRefuel.date.seconds * 1000).toLocaleString()}</Typography>
                <Typography>Mileage: {car.lastRefuel.mileage.toLocaleString()} km</Typography>
                <pre>{JSON.stringify(car.lastRefuel, null, 2)}</pre>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item>
          <pre>{JSON.stringify(car, null, 2)}</pre>
        </Grid>
      </Grid>
    </Layout>
  );
}
