import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { PersonAdd as PersonAddIcon, Share as ShareIcon } from '@material-ui/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createCarInvite } from '../../../data';

const useStyles = makeStyles(({ spacing }) => ({
  buttonIcon: {
    marginRight: spacing(1),
  },
}));

export default function Invite({ car, owner, ...props }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();
  const linkRef = useRef();
  const openDialog = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  const closeDialog = useCallback(() => setDialogOpen(false), [setDialogOpen]);

  const createInviteLink = useCallback(async () => {
    setError(null);
    setPending(true);
    try {
      const { id: inviteId } = await createCarInvite(car, owner);
      setInviteLink(`https://drivr.jardas.de/invites/${car.id}/${inviteId}`);
      setPending(false);
    } catch (error) {
      setError(error);
      setPending(false);
    }
  }, [car, owner, setPending, setInviteLink]);

  const shareInviteLink = useCallback(() => {
    if (inviteLink && typeof navigator.share === 'function') {
      navigator.share({
        title: 'drivr',
        text: `Please help me track the expenses of my car ${car.label} with drivr.`,
        url: inviteLink,
      });
    }
  }, [car.label, inviteLink]);

  useEffect(() => {
    if (inviteLink && linkRef.current) {
      linkRef.current.select();
      document.execCommand('copy');
    }
  }, [inviteLink]);

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Button onClick={openDialog} {...props}>
        <PersonAddIcon className={classes.buttonIcon} /> invite collaborator
      </Button>
      <Dialog open={dialogOpen} fullScreen={fullScreen} onClose={closeDialog}>
        <DialogTitle>Invite for collaboration</DialogTitle>
        <DialogContent>
          <DialogContentText>Invite someone to allow them to record refuels for your car.</DialogContentText>
          {error && <DialogContentText color="error">Error: {error.message}</DialogContentText>}
          {inviteLink && (
            <>
              <TextField inputRef={linkRef} label="Invite link" value={inviteLink} fullWidth autoFocus margin="normal" />
              <DialogContentText>Copy this link and send it to the person you want to invite. The link was copied to your clipboard.</DialogContentText>
              {typeof navigator.share === 'function' && (
                <Button onClick={shareInviteLink}>
                  <ShareIcon className={classes.buttonIcon} /> share invite link
                </Button>
              )}
            </>
          )}
          <Button onClick={createInviteLink} color="primary" variant="contained" disabled={pending}>
            {pending ? <CircularProgress size="1em" color="inherit" className={classes.buttonIcon} /> : <PersonAddIcon className={classes.buttonIcon} />}
            create {inviteLink && 'another'} invite link
          </Button>
        </DialogContent>
        <DialogActions>
          <Button type="reset" onClick={closeDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
