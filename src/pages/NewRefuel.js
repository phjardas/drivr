import { Button, Card, CardContent, CircularProgress, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Field, Form, Formik, useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { boolean, number, object, string } from 'yup';
import { auth, Firebase, firestore } from '../firebase';
import Layout from '../Layout';
import Loading from '../Loading';

export default function NewRefuel() {
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [car, loading, error] = useDocumentData(firestore.collection('cars').doc(id), { idField: 'id' });

  if (loading) return <Loading layout={true} />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout title={car.label} back={`/cars/${car.id}`}>
      <NewRefuelForm car={car} user={user} />
    </Layout>
  );
}

const useStyles = makeStyles(({ palette, spacing }) => ({
  card: {
    maxWidth: `calc(100% - ${spacing(4)}px)`,
    width: 600,
    margin: '0 auto',
  },
  cancelButton: {
    color: palette.text.secondary,
    marginLeft: spacing(1),
  },
}));

function NewRefuelForm({ car, user }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const initialValues = useMemo(() => {
    const now = new Date();
    return {
      date: now.toISOString().substring(0, 10),
      time: now.toISOString().substring(11, 19),
      mileage: '',
      fuelAmount: '',
      totalPrice: '',
      incomplete: false,
    };
  }, []);

  const onSubmit = useCallback(
    async (refuel, { setSubmitting, setState }) => {
      const { date, time, incomplete } = refuel;
      const mileage = parseInt(refuel.mileage, 10);
      const totalPrice = parseFloat(refuel.totalPrice, 10);
      const fuelAmount = parseFloat(refuel.fuelAmount, 10);

      const payload = {
        date: new Date(`${date}T${time}`),
        carId: car.id,
        userId: user.uid,
        createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
        mileage,
        totalPrice,
        fuelAmount,
        incomplete,
        pricePerLiter: totalPrice / fuelAmount,
      };

      try {
        const ref = await firestore.collection('refuels').add(payload);
        const result = await ref.get();
        const lastRefuel = { ...result.data(), id: result.id };
        await firestore
          .collection('cars')
          .doc(car.id)
          .update({ lastRefuel });
        navigate(`/cars/${car.id}`);
      } catch (error) {
        console.error(error);
        setState(error);
        setSubmitting(false);
      }
    },
    [car, user, navigate]
  );

  const schema = useMemo(() => {
    return object({
      date: string().required(),
      time: string().required(),
      mileage: number()
        .required()
        .min(car.lastRefuel ? car.lastRefuel.mileage : 0),
      fuelAmount: number()
        .required()
        .min(0),
      totalPrice: number()
        .required()
        .min(0),
      incomplete: boolean().required(),
    });
  }, [car]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          New Refuel
        </Typography>
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
          {() => (
            <Form>
              <NewRefuelFormContent car={car} schema={schema} classes={classes} />
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

function NewRefuelFormContent({ car, schema, classes }) {
  const { values, dirty, isValid, isSubmitting } = useFormikContext();
  const parsed = useMemo(() => parseValues(values, schema), [values, schema]);
  const derived = useMemo(() => deriveValues(parsed, car), [parsed, car]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Field name="date">
            {({ field, meta }) => <TextField type="date" label="Date" required {...field} error={Boolean(meta.error)} helperText={meta.error} fullWidth />}
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field name="time">
            {({ field, meta }) => <TextField type="time" label="Time" required {...field} error={Boolean(meta.error)} helperText={meta.error} fullWidth />}
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Field name="mileage">
            {({ field, meta }) => (
              <TextField
                label="Mileage (km)"
                required
                {...field}
                error={Boolean(meta.error)}
                helperText={meta.error || (derived.distance && `Distance: ${derived.distance.toLocaleString()} km`)}
                fullWidth
                autoFocus
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Field name="fuelAmount">
            {({ field, meta }) => (
              <TextField
                label="Fuel amount (liters)"
                required
                {...field}
                error={Boolean(meta.error)}
                helperText={meta.error || (derived.consumption && `Consumption: ${(derived.consumption * 100).toLocaleString()} cl/km`)}
                fullWidth
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Field name="totalPrice">
            {({ field, meta }) => (
              <TextField
                label="Total price (€)"
                required
                {...field}
                error={Boolean(meta.error)}
                helperText={meta.error || (derived.pricePerLiter && `Price: ${derived.pricePerLiter.toLocaleString()} €/l`)}
                fullWidth
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!dirty || !isValid || isSubmitting}
            startIcon={isSubmitting && <CircularProgress />}
          >
            Save new refuel
          </Button>
          <Button type="reset" variant="text" component={Link} to={`/cars/${car.id}`} className={classes.cancelButton}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

function parseValues(values, schema) {
  try {
    return schema.validateSync(values, { abortEarly: false });
  } catch (error) {
    return error.value;
  }
}

function deriveValues(values, car) {
  if (!values) return {};
  const { lastRefuel } = car;
  const { mileage, fuelAmount, totalPrice } = values;

  const distance = mileage && lastRefuel && mileage > lastRefuel.mileage ? mileage - lastRefuel.mileage : undefined;
  const consumption = distance && fuelAmount ? fuelAmount / distance : undefined;
  const pricePerLiter = fuelAmount && totalPrice ? totalPrice / fuelAmount : undefined;

  return {
    distance,
    consumption,
    pricePerLiter,
  };
}
