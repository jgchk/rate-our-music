import process from 'process';
import elm from 'rollup-plugin-elm'
import del from 'rollup-plugin-delete';
import html from '@rollup/plugin-html';
import { terser } from 'rollup-plugin-terser';

const OUTPUT_DIR = 'output';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV = !IS_PROD;

export default {
  input: 'src/index.js',
  output: {
    dir: OUTPUT_DIR,
    format: 'esm',
  },
  plugins: [
    elm({
      exclude: 'elm_stuff/**',
      compiler: {
        debug: IS_DEV,
        optimize: IS_PROD,
      }
    }),
    del(),
    html(),
    ...IS_PROD 
      ? [
        terser({
          compress: {
            pure_funcs: ['F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
            pure_getters: true,
            keep_fargs: false,
            unsafe_comps: true,
            unsafe: true,
            passes: 3,
          },
        }),
        terser({ mangle: true }),
      ] 
      : [],
  ],
};
