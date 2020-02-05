import { Button, Card, CardContent, CircularProgress, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { useCars } from '../data';
import { auth, firestore } from '../firebase';
import Layout from '../Layout';
import Loading from '../Loading';

export default function NewCar() {
  const [user] = useAuthState(auth);
  const [cars, loading, error] = useCars();
  if (loading) return <Loading layout={true} />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout title="New car" back="/cars">
      <NewCarForm user={user} cars={cars} />
    </Layout>
  );
}

const useStyles = makeStyles(({ palette, spacing }) => ({
  card: {
    maxWidth: `calc(100% - ${spacing(4)}px)`,
    width: 600,
    margin: `0 auto`,
  },
  cancelButton: {
    color: palette.text.secondary,
    marginLeft: spacing(1),
  },
}));

const initialValues = {
  label: '',
};

function NewCarForm({ cars, user }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const schema = useMemo(
    () =>
      object({
        label: string()
          .required()
          .test('label-unique', 'The car label must be unique', (label) => !cars.some((car) => car.label === label)),
      }),
    [cars]
  );

  const onSubmit = useCallback(
    async (data, { setSubmitting, setState }) => {
      try {
        const ref = await firestore.collection('cars').add({ ...data, ownerId: user.uid, users: { [user.uid]: true } });
        const result = await ref.get();
        navigate(`/cars/${result.id}`);
      } catch (error) {
        console.error(error);
        setState(error);
        setSubmitting(false);
      }
    },
    [user, navigate]
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          New Car
        </Typography>
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
          {({ dirty, isValid, isSubmitting }) => (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Field name="label">
                    {({ field, meta }) => (
                      <TextField
                        label="Label (eg. license plate)"
                        required
                        {...field}
                        error={Boolean(meta.error)}
                        helperText={meta.error}
                        fullWidth
                        autoFocus
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
                    Create car
                  </Button>
                  <Button type="reset" variant="text" component={Link} to="/" className={classes.cancelButton}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
