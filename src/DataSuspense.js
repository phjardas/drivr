import { Typography } from '@material-ui/core';
import React from 'react';
import DelayedProgress from './DelayedProgress';

export default function DataSuspense({ loading, error, data, children }) {
  if (loading) return <DelayedProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  return children(data);
}
