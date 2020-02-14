import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  external: ['core-js', 'firebase-admin', 'firebase-functions'],
  plugins: [resolve(), commonjs()],
};
