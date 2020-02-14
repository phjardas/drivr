import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Delay from './Delay';

export default function DelayedProgress({ wait = 300 }) {
  return (
    <Delay wait={wait}>
      <CircularProgress />
    </Delay>
  );
}
