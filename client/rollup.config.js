import process from 'process';
import html from '@rollup/plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
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
    nodeResolve(),
    typescript(),
    del({ targets: OUTPUT_DIR }),
    ...IS_DEV ? [html(), dev(OUTPUT_DIR)] : [],
    ...IS_PROD ? [terser()] : [],
  ],
};
