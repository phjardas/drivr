import { Button, IconButton, Snackbar } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useCache } from './cache';

export default function UpdateNotification() {
  const { updated } = useCache();
  const [open, setOpen] = useState(updated);
  useEffect(() => {
    if (updated) setOpen(updated);
  }, [updated]);
  const handleReload = () => window.location.reload(true);
  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      onClose={handleClose}
      message="The application has been updated."
      action={[
        <Button key="reload" color="secondary" size="small" onClick={handleReload}>
          Reload
        </Button>,
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>,
      ]}
    />
  );
}
