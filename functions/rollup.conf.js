import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs',
  },
  external: Object.keys(require('./package.json').dependencies),
  plugins: [resolve(), commonjs()],
};
