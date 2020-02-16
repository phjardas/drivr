import { Avatar, Button, IconButton, makeStyles, Popover, Typography } from '@material-ui/core';
import { Person as PersonIcon } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import { useAuth } from './auth';

export default function UserProfileButton() {
  const { user, signOut } = useAuth();
  const [anchor, setAnchor] = useState();
  const handleClick = useCallback((e) => setAnchor(e.currentTarget), [setAnchor]);
  const handleClose = useCallback(() => setAnchor(null), [setAnchor]);

  if (!user) return null;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        {user.photoURL ? <Avatar src={user.photoURL} alt={user.displayName || user.email} /> : <PersonIcon />}
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <UserPopover user={user} signOut={signOut} />
      </Popover>
    </>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  wrapper: {
    display: 'flex',
  },
  image: {},
  info: {
    padding: spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  signout: {
    marginTop: 'auto',
  },
}));

function UserPopover({ user, signOut }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {user.photoURL && <img src={user.photoURL} width={128} height={128} className={classes.image} alt={user.label} />}
      <div className={classes.info}>
        {user.label && <Typography gutterBottom>{user.label}</Typography>}
        <Button onClick={signOut} fullWidth className={classes.signout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
