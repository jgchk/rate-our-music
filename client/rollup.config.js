import path from 'path';
import process from 'process';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import html from '@rollup/plugin-html';
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
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true
    }),
    resolve(),
    commonjs(),
    typescript(),
    del({ targets: OUTPUT_DIR }),
    html(),
    ...IS_PROD ? [terser()] : [],
  ],
};
