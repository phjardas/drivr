import { CircularProgress, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React from 'react';
import { useRefuels } from '../../../data';

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
    flexDirection: 'column',
    flexBasis: '33.33%',
    flexShrink: 0,
  },
}));

function Refuels({ refuels }) {
  const classes = useStyles();

  return refuels.map((refuel) => (
    <ExpansionPanel key={refuel.id}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{new Date(refuel.date.seconds * 1000).toLocaleDateString()}</Typography>
        <Typography className={classes.secondaryHeading}>{refuel.mileage.toLocaleString()} km</Typography>
        {refuel.consumption && <Typography className={classes.secondaryHeading}>{(refuel.consumption * 100).toLocaleString()} cl/km</Typography>}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <Typography>
          {refuel.fuelAmount.toLocaleString()} liters for {refuel.totalPrice.toLocaleString()} €
        </Typography>
        {refuel.distance && <Typography>Distance: {refuel.distance.toLocaleString()} km</Typography>}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ));
}

export default function RefuelsList({ car }) {
  const [refuels, loading, error] = useRefuels(car.id, ['date', 'desc']);
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  return <Refuels refuels={refuels} />;
}
