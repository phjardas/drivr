import { Card, CardContent, Grid, Slider, Typography, useTheme } from '@material-ui/core';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LineSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import 'react-vis/dist/style.css';
import { useRefuels } from '../../../data';
import DelayedProgress from '../../../DelayedProgress';

const smoothingLocaleStorageKey = 'drivr:chart-smoothing';

function Charts({ refuels }) {
  const [smoothing, setSmoothing] = useState(parseFloat(localStorage.getItem(smoothingLocaleStorageKey) || '0.9', 10));
  const updateSmoothing = useCallback(
    (value) => {
      localStorage.setItem(smoothingLocaleStorageKey, value.toString());
      setSmoothing(value);
    },
    [setSmoothing]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Settings smoothing={smoothing} setSmoothing={updateSmoothing} />
      </Grid>
      <Grid item xs={12} md={6}>
        <MileageOverTimeChart refuels={refuels} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ConsumptionOverTimeChart refuels={refuels} smoothing={smoothing} />
      </Grid>
      <Grid item xs={12} md={6}>
        <FuelPriceOverTimeChart refuels={refuels} smoothing={smoothing} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DistanceOverTimeChart refuels={refuels} smoothing={smoothing} />
      </Grid>
    </Grid>
  );
}

function Settings({ smoothing, setSmoothing }) {
  return (
    <>
      <Typography gutterBottom>Smoothing</Typography>
      <Slider min={0} max={1} step={0.01} value={smoothing} onChange={(_, v) => setSmoothing(v)} />
    </>
  );
}

function MileageOverTimeChart({ refuels }) {
  const { palette } = useTheme();
  const data = useMemo(() => refuels.map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.mileage })), [refuels]);

  return (
    <ChartCard title="Mileage over time">
      {(props) => (
        <XYPlot {...props} xType="time">
          <XAxis />
          <YAxis />
          <LineSeries data={data} stroke={palette.primary.main} curve="basis" />
        </XYPlot>
      )}
    </ChartCard>
  );
}

function ConsumptionOverTimeChart({ refuels, smoothing }) {
  const data = useMemo(
    () => refuels.filter((refuel) => refuel.consumption).map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.consumption * 100 })),
    [refuels]
  );
  return <SmoothedChart title="Consumption over time" data={data} smoothing={smoothing} />;
}

function FuelPriceOverTimeChart({ refuels, smoothing }) {
  const data = useMemo(
    () => refuels.filter((refuel) => refuel.pricePerLiter).map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.pricePerLiter })),
    [refuels]
  );
  return <SmoothedChart title="Price over time" data={data} smoothing={smoothing} />;
}

function DistanceOverTimeChart({ refuels, smoothing }) {
  const data = useMemo(() => refuels.filter((refuel) => refuel.distance).map((refuel) => ({ x: new Date(refuel.date.seconds * 1000), y: refuel.distance })), [
    refuels,
  ]);
  return <SmoothedChart title="Distance over time" data={data} smoothing={smoothing} />;
}

function SmoothedChart({ data, title, smoothing }) {
  const { palette } = useTheme();
  const dataAttenuated = useAttenuated(data, smoothing);

  return (
    <ChartCard title={title}>
      {(props) => (
        <XYPlot {...props} xType="time">
          <XAxis />
          <YAxis />
          <LineSeries data={data} stroke={palette.secondary.light} curve="basis" />
          <LineSeries data={dataAttenuated} stroke={palette.primary.main} curve="basis" />
        </XYPlot>
      )}
    </ChartCard>
  );
}

function ChartCard({ title, children }) {
  const [width, setWidth] = useState();
  const cardRef = useRef();

  const updateSize = useCallback(() => {
    if (cardRef.current) {
      const style = getComputedStyle(cardRef.current, null);
      const paddingLeft = parseInt(style.paddingLeft.replace(/px$/, ''), 10);
      const paddingRight = parseInt(style.paddingRight.replace(/px$/, ''), 10);
      setWidth(cardRef.current.clientWidth - paddingLeft - paddingRight);
    } else {
      setWidth(null);
    }
  }, [setWidth]);

  useLayoutEffect(updateSize, [updateSize]);
  useEffect(() => {
    const listener = debounce(updateSize, 300);
    window.addEventListener('resize', listener, false);
    return () => window.removeEventListener('resize', listener);
  }, [updateSize]);

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
  if (loading) return <DelayedProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  return <Charts refuels={refuels} />;
}

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

function useAttenuated(data, smoothing) {
  return useMemo(() => data.reduce((agg, d) => [...agg, { x: d.x, y: agg.length ? agg[agg.length - 1].y * smoothing + d.y * (1 - smoothing) : d.y }], []), [
    data,
    smoothing,
  ]);
}
