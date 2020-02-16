import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../auth';
import { useAcceptCarInvitation, useCarInvite } from '../data';
import DataSuspense from '../DataSuspense';
import MiniLayout from '../MiniLayout';
import Redirect from '../Redirect';
import SignIn from '../SignIn';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(2),
  },
}));

export default function Invite() {
  const { user } = useAuth();
  const { carId, inviteId } = useParams();
  const [data, loading, error] = useCarInvite(carId, inviteId);
  const classes = useStyles();

  return (
    <MiniLayout>
      <DataSuspense data={data} loading={loading} error={error}>
        {(invite) => (
          <>
            <div className={classes.title}>
              <Typography variant="h6" component="div" gutterBottom>
                {invite.ownerLabel} would like to give you access to their car {invite.carLabel}.
              </Typography>
              <Typography gutterBottom>You will be able to record refuels and see statistics for this car.</Typography>
            </div>
            {user ? (
              <AcceptInvite carId={carId} invite={invite} user={user} />
            ) : (
              <>
                <Typography gutterBottom>Please sign in to accept their invitation.</Typography>
                <SignIn />
              </>
            )}
          </>
        )}
      </DataSuspense>
    </MiniLayout>
  );
}

function AcceptInvite({ carId, invite, user }) {
  const acceptCarInvitation = useAcceptCarInvitation();
  const [{ loading, error, success }, setState] = useState({});
  const acceptInvitation = useCallback(async () => {
    try {
      setState({ loading: true });
      await acceptCarInvitation(carId, invite.id);
      setState({ success: true });
    } catch (error) {
      setState({ error });
    }
  }, [carId, invite.id, acceptCarInvitation]);

  if (success) {
    return <Redirect to={`/cars/${carId}`} />;
  }

  if (user.id === invite.ownerId) {
    return <Typography color="error">You cannot accept your own invitation.</Typography>;
  }

  return (
    <>
      {error && (
        <Typography color="error" gutterBottom>
          {error.message}
        </Typography>
      )}
      <Button variant="contained" color="secondary" fullWidth disabled={loading} onClick={acceptInvitation}>
        accept invitation
      </Button>
    </>
  );
}
