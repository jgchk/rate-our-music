import process from 'process';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import html from '@rollup/plugin-html';
import dev from 'rollup-plugin-dev';
import { terser } from 'rollup-plugin-terser';

const OUTPUT_DIR = 'output';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV = !IS_PROD;

export default {
  input: 'src/index.tsx',
  output: {
    dir: OUTPUT_DIR,
    format: 'esm',
  },
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' }
      ]
    }),
    resolve(),
    commonjs(),
    typescript(),
    del({ targets: OUTPUT_DIR }),
    ...IS_DEV ? [html(), dev({ dirs: [OUTPUT_DIR], proxy: { '/graphql': 'http://localhost:3030/graphql' } })] : [],
    ...IS_PROD ? [terser()] : [],
  ],
};
