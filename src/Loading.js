import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Layout from './Layout';

export default function Loading() {
  return (
    <Layout>
      <CircularProgress />
    </Layout>
  );
}
