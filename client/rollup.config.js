import process from 'process'
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import html from '@rollup/plugin-html'
import serve from 'rollup-plugin-serve'
import liveReload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

const config = {
  input: 'src/main.tsx',
  outputDir: 'output',
  jsFormat: 'esm',
}

const production = process.env.NODE_ENV === 'production'

export default {
  input: config.input,
  output: {
    dir: config.outputDir,
    format: config.jsFormat,
    sourcemap: !production,
  },
  plugins: [
    del({ targets: config.outputDir, runOnce: true }),

    typescript({ sourceMap: !production }),
    postcss({ sourceMap: !production, minimize: production }),

    resolve({ browser: true }),

    html(),

    !production && serve(config.outputDir),
    !production && liveReload(config.outputDir),

    production && terser(),
  ],
}
