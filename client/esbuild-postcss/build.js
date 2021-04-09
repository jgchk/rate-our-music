const esbuild = require('esbuild')
const process = require('process')
const pnpPlugin = require('esbuild-plugin-pnp')

esbuild
  .build({
    target: 'es2018',
    entryPoints: ['./src/index.ts'],
    outdir: './output',
    format: 'cjs',
    plugins: [pnpPlugin()],
  })
  .catch(() => process.exit(1))
