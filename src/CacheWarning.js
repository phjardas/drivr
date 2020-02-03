import React from 'react';
import Delay from './Delay';

export default function CacheWarning() {
  return (
    <Delay wait={500}>
      <p>This data is cached and may be outdated.</p>
    </Delay>
  );
}
