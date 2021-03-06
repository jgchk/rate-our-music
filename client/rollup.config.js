/* eslint-disable @typescript-eslint/no-unsafe-call */

import html from '@rollup/plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import dev from 'rollup-plugin-dev';

const OUTPUT_DIR = 'output';

export default {
  input: 'src/index.tsx',
  output: {
    dir: OUTPUT_DIR,
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    typescript(),
    html(),
    del({ targets: OUTPUT_DIR, },),
    dev(OUTPUT_DIR,),
  ],
};
