import { Card, CardContent, CircularProgress, Grid, Typography, useTheme } from '@material-ui/core';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LineSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import 'react-vis/dist/style.css';
import { useRefuels } from '../../../data';

function Charts({ refuels }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <MileageOverTimeChart refuels={refuels} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ConsumptionOverTimeChart refuels={refuels} />
      </Grid>
      <Grid item xs={12} md={6}>
        <FuelPriceOverTimeChart refuels={refuels} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DistanceOverTimeChart refuels={refuels} />
      </Grid>
    </Grid>
  );
}

function MileageOverTimeChart({ refuels }) {
  const { palette } = useTheme();
  const data = useMemo(() => refuels.map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.mileage })), [refuels]);

  return (
    <ChartCard title="Mileage over time">
      {(props) => (
        <XYPlot {...props}>
          <XAxis />
          <YAxis />
          <LineSeries data={data} stroke={palette.primary.main} curve="basis" />
        </XYPlot>
      )}
    </ChartCard>
  );
}

function ConsumptionOverTimeChart({ refuels }) {
  const { palette } = useTheme();
  const data = useMemo(
    () => refuels.filter((refuel) => refuel.consumption).map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.consumption * 100 })),
    [refuels]
  );

  return (
    <ChartCard title="Consumption over time">
      {(props) => (
        <XYPlot {...props}>
          <XAxis />
          <YAxis />
          <LineSeries data={data} stroke={palette.primary.main} curve="basis" />
        </XYPlot>
      )}
    </ChartCard>
  );
}

function FuelPriceOverTimeChart({ refuels }) {
  const { palette } = useTheme();
  const data = useMemo(
    () => refuels.filter((refuel) => refuel.pricePerLiter).map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.pricePerLiter })),
    [refuels]
  );

  return (
    <ChartCard title="Fuel price over time">
      {(props) => (
        <XYPlot {...props}>
          <XAxis />
          <YAxis />
          <LineSeries data={data} stroke={palette.primary.main} curve="basis" />
        </XYPlot>
      )}
    </ChartCard>
  );
}

function DistanceOverTimeChart({ refuels }) {
  const { palette } = useTheme();
  const data = useMemo(() => refuels.filter((refuel) => refuel.distance).map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.distance })), [
    refuels,
  ]);

  return (
    <ChartCard title="Distance over time">
      {(props) => (
        <XYPlot {...props}>
          <XAxis />
          <YAxis />
          <LineSeries data={data} stroke={palette.primary.main} curve="basis" />
        </XYPlot>
      )}
    </ChartCard>
  );
}

function ChartCard({ title, children }) {
  const [width, setWidth] = useState();
  const cardRef = useRef();
  useLayoutEffect(() => {
    if (cardRef.current) {
      const style = getComputedStyle(cardRef.current, null);
      const paddingLeft = parseInt(style.paddingLeft.replace(/px$/, ''), 10);
      const paddingRight = parseInt(style.paddingRight.replace(/px$/, ''), 10);
      setWidth(cardRef.current.clientWidth - paddingLeft - paddingRight);
    }
  }, [setWidth]);

  return (
    <Card>
      <CardContent ref={cardRef}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {width && children({ width, height: (width * 3) / 4 })}
      </CardContent>
    </Card>
  );
}

export default function CarCharts({ car }) {
  const [refuels, loading, error] = useRefuels(car.id, ['date', 'asc']);
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  return <Charts refuels={refuels} />;
}
