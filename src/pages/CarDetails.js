import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, LocalGasStation as RefuelIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CacheWarning from '../CacheWarning';
import { useRefuels } from '../data';
import Fab from '../Fab';
import Layout from '../Layout';

const useStyles = makeStyles({
  card: {
    height: '100%',
  },
});

export default function CarDetails({ car }) {
  const classes = useStyles();
  const hasStats = car.stats && car.stats.refuelCount > 0;

  return (
    <Layout title={car.label} back="/cars" gutter>
      <Container>
        {car._cached && <CacheWarning />}
        <Grid container spacing={2}>
          {hasStats ? (
            <>
              <Grid item xs={12} sm={6}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Last Refuel
                    </Typography>
                  </CardContent>
                  <Refuel refuel={car.lastRefuel} />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Statistics
                    </Typography>
                  </CardContent>
                  <Statistics stats={car.stats} />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Refuels car={car} />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography>This car has not enough refuels yet to show statistics.</Typography>
                </CardContent>
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

function Refuels({ car }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded((e) => !e)}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" component="h2">
          Refuels
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{expanded && <RefuelsList car={car} />}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

function RefuelsList({ car }) {
  const [refuels, loading, error] = useRefuels(car.id);
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <List dense disablePadding>
      {refuels.map((refuel) => (
        <ListItem key={refuel.id} disableGutters>
          <ListItemText
            primary={`${new Date(refuel.date.seconds * 1000).toLocaleString()} at ${refuel.mileage.toLocaleString()} km`}
            secondary={`${refuel.fuelAmount.toLocaleString()} liters for ${refuel.totalPrice.toLocaleString()} €`}
          />
        </ListItem>
      ))}
    </List>
  );
}
