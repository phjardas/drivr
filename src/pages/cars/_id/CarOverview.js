import { Card, CardContent, Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useAuth } from '../../../auth';
import { unshareCar } from '../../../data';
import UserChip from '../../../UserChip';
import Invite from './Invite';

const useStyles = makeStyles({
  card: {
    height: '100%',
  },
});

export default function CarOverview({ car }) {
  const { user } = useAuth();
  const owned = car.ownerId === user.id;
  const classes = useStyles();
  const hasStats = car.stats && car.stats.refuelCount > 0;
  const unshare = useCallback(
    (userId) => {
      if (window.confirm(`Do you really want to unshare this car?`)) {
        unshareCar(car.id, userId);
      }
    },
    [car.id]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card className={classes.card}>
          <CardContent>
            <div>
              Owned by {owned ? 'you' : <UserChip id={car.ownerId} />}.
              {owned && (
                <>
                  {Object.keys(car.users).length > 1 && (
                    <>
                      {' '}
                      Shared with{' '}
                      {Object.keys(car.users)
                        .filter((u) => u !== car.ownerId)
                        .map((uid) => (
                          <UserChip key={uid} id={uid} style={{ marginRight: '0.5rem' }} onDelete={() => unshare(uid)} />
                        ))}
                    </>
                  )}
                  <Invite car={car} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
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
      {stats.totalDistance > 0 && (
        <ListItem>
          <ListItemText primary={`Total distance: ${stats.totalDistance.toLocaleString()} km`} />
        </ListItem>
      )}
      {stats.totalFuel > 0 && (
        <ListItem>
          <ListItemText primary={`Total fuel: ${stats.totalFuel.toLocaleString()} l`} secondary={`${stats.refuelCount} refuels`} />
        </ListItem>
      )}
      {stats.averageConsumption > 0 && (
        <ListItem>
          <ListItemText
            primary={`Consumption: ${(stats.averageConsumption * 100).toLocaleString()} cl/km`}
            secondary={stats.averagePricePerDistance && `${(stats.averagePricePerDistance * 100).toLocaleString()} Ct./km`}
          />
        </ListItem>
      )}
      {stats.totalPrice > 0 && (
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
