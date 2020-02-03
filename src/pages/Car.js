import { Card, CardContent, Container, Fab, Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { LocalGasStation as RefuelIcon } from '@material-ui/icons';
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Link, useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import Layout from '../Layout';
import Loading from '../Loading';

const useStyles = makeStyles(({ spacing }) => ({
  wrapper: {
    marginTop: spacing(2),
  },
  fab: {
    position: 'fixed',
    bottom: spacing(2),
    right: spacing(2),
  },
}));

export default function Car() {
  const { id } = useParams();
  const [car, loading, error] = useDocumentData(firestore.collection('cars').doc(id), { idField: 'id' });
  const classes = useStyles();

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout title={car.label} back="/cars">
      <Container className={classes.wrapper}>
        <Grid container spacing={8}>
          {car.lastRefuel && (
            <Grid item sm={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Last Refuel
                  </Typography>
                  <Refuel refuel={car.lastRefuel} />
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid item sm={12} md={6}>
            <pre>{JSON.stringify(car, null, 2)}</pre>
          </Grid>
        </Grid>
        <Fab color="secondary" className={classes.fab} component={Link} to={`/cars/${car.id}/refuels/_new`}>
          <RefuelIcon />
        </Fab>
      </Container>
    </Layout>
  );
}

function Refuel({ refuel }) {
  return (
    <>
      <List>
        <ListItem>
          <ListItemText primary={`Date: ${new Date(refuel.date.seconds * 1000).toLocaleString()}`} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Mileage: ${refuel.mileage.toLocaleString()} km`}
            secondary={refuel.distance && `Distance: ${refuel.distance.toLocaleString()} km`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Fuel: ${refuel.fuelAmount.toLocaleString()} l`}
            secondary={refuel.consumption && `Consumption: ${(refuel.consumption * 100).toLocaleString()} cl/km`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Price: ${refuel.totalPrice.toLocaleString()} l`}
            secondary={refuel.pricePerLiter && `${refuel.pricePerLiter.toLocaleString()} €/l`}
          />
        </ListItem>
      </List>
    </>
  );
}
