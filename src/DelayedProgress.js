import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Delay from './Delay';

export default function DelayedProgress({ wait = 300, ...props }) {
  return (
    <Delay wait={wait}>
      <CircularProgress {...props} />
    </Delay>
  );
}
