import { IconButton, Snackbar } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useCache } from './cache';

export default function CacheNotification() {
  const { cached } = useCache();
  const [open, setOpen] = useState(cached);
  useEffect(() => {
    if (cached) setOpen(cached);
  }, [cached]);
  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message="Data has been cached and is now available offline."
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
