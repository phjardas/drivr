import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Delay from './Delay';
import Layout from './Layout';
import MiniLayout from './MiniLayout';

export default function Loading({ layout, layoutProps, ...props }) {
  return layout ? (
    <Layout {...layoutProps}>
      <Spinner {...props} />
    </Layout>
  ) : (
    <Spinner {...props} />
  );
}

function Spinner({ wait = 300 }) {
  return (
    <Delay wait={wait}>
      <MiniLayout>
        <CircularProgress color="primary" />
      </MiniLayout>
    </Delay>
  );
}
