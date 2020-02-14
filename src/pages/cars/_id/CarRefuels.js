import { CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import { useDeleteRefuel, useRefuels } from '../../../data';
import DataSuspense from '../../../DataSuspense';

const useStyles = makeStyles(({ palette }) => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: palette.text.secondary,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  details: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
}));

function Refuels({ carId, refuels }) {
  const deleteRefuel = useDeleteRefuel(carId);

  return refuels.map((refuel, index) => <Refuel key={refuel.id} refuel={refuel} onDelete={index === 0 && (() => deleteRefuel(refuel.id))} />);
}

function Refuel({ refuel, onDelete }) {
  const classes = useStyles();

  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting refuel:', error);
    } finally {
      setDeleting(false);
    }
  }, [setDeleting, onDelete]);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{new Date(refuel.date.seconds * 1000).toLocaleDateString()}</Typography>
        <Typography className={classes.secondaryHeading}>{refuel.mileage.toLocaleString()} km</Typography>
        {refuel.consumption && <Typography className={classes.secondaryHeading}>{(refuel.consumption * 100).toLocaleString()} cl/km</Typography>}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <div>
          <Typography>
            {refuel.fuelAmount.toLocaleString()} liters for {refuel.totalPrice.toLocaleString()} €
          </Typography>
          <Typography>{refuel.pricePerLiter.toLocaleString()} €/liter</Typography>
          <Typography>Mileage: {refuel.mileage.toLocaleString()} km</Typography>
          {refuel.distance && <Typography>Distance: {refuel.distance.toLocaleString()} km</Typography>}
          {refuel.consumption && <Typography>Consumption: {(refuel.consumption * 100).toLocaleString()} cl/km</Typography>}
        </div>
        {onDelete && (
          <div className={classes.actions}>
            {deleting ? (
              <IconButton disabled>
                <CircularProgress size="1em" color="inherit" />
              </IconButton>
            ) : (
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default function RefuelsList({ car }) {
  const [data, loading, error] = useRefuels(car.id, ['date', 'desc']);
  return (
    <DataSuspense loading={loading} error={error} data={data}>
      {(refuels) => <Refuels carId={car.id} refuels={refuels} />}
    </DataSuspense>
  );
}
