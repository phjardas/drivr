import { Avatar, Chip, Typography } from '@material-ui/core';
import React from 'react';
import { useUser } from './data';
import DelayedProgress from './DelayedProgress';

export default function UserChip({ id, ...props }) {
  const [user, loading, error] = useUser(id);
  if (loading) return <DelayedProgress size="1em" />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  return <Chip avatar={user.photoURL && <Avatar src={user.photoURL} />} label={user.label} {...props} />;
}
