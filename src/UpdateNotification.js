import { IconButton, Snackbar } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useCache } from './cache';

export default function UpdateNotification() {
  const { updated } = useCache();
  const [open, setOpen] = useState(updated);
  useEffect(() => {
    if (updated) setOpen(updated);
  }, [updated]);
  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      onClose={handleClose}
      message="The application was updated. Reload the browser window to apply changes."
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
