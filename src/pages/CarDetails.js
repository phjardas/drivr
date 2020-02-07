import { Card, CardContent, Container, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { LocalGasStation as RefuelIcon } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import CacheWarning from '../CacheWarning';
import Fab from '../Fab';
import Layout from '../Layout';

export default function CarDetails({ car }) {
  return (
    <Layout title={car.label} back="/cars" gutter>
      <Container>
        {car._cached && <CacheWarning />}
        <Grid container spacing={2}>
          {!car.stats && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography>This car has not enough refuels yet to show statistics.</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {car.lastRefuel && (
            <Grid item xs={12} sm={6}>
              <Card>
                <>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Last Refuel
                    </Typography>
                  </CardContent>
                  <Refuel refuel={car.lastRefuel} />
                </>
              </Card>
            </Grid>
          )}
          {car.stats && (
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Statistics
                  </Typography>
                </CardContent>
                <Statistics stats={car.stats} />
              </Card>
            </Grid>
          )}
        </Grid>
        <Fab component={Link} to={`/cars/${car.id}/refuels/_new`}>
          <RefuelIcon />
        </Fab>
      </Container>
    </Layout>
  );
}

function Refuel({ refuel }) {
  return (
    <List dense>
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
  );
}

function Statistics({ stats }) {
  return (
    <List dense>
      {stats.totalDistance && (
        <ListItem>
          <ListItemText primary={`Total distance: ${stats.totalDistance.toLocaleString()} km`} />
        </ListItem>
      )}
      {stats.totalFuel && (
        <ListItem>
          <ListItemText primary={`Total fuel: ${stats.totalFuel.toLocaleString()} l`} secondary={`${stats.refuelCount} refuels`} />
        </ListItem>
      )}
      {stats.averageConsumption && (
        <ListItem>
          <ListItemText
            primary={`Consumption: ${(stats.averageConsumption * 100).toLocaleString()} cl/km`}
            secondary={stats.averagePricePerDistance && `${(stats.averagePricePerDistance * 100).toLocaleString()} Ct./km`}
          />
        </ListItem>
      )}
      {stats.totalPrice && (
        <ListItem>
          <ListItemText
            primary={`Total spendings: ${stats.totalPrice.toLocaleString()} €`}
            secondary={stats.averagePricePerVolume && `${stats.averagePricePerVolume.toLocaleString()} €/l`}
          />
        </ListItem>
      )}
    </List>
  );
}
