const esbuild = require('esbuild')
const process = require('process')
const pnpPlugin = require('esbuild-plugin-pnp')
const { default: postCssPlugin } = require('./esbuild-postcss/build')
const postCssNesting = require('postcss-nesting')
const postCssColorModFunction = require('postcss-color-mod-function')

const isDev = process.env.NODE_ENV === 'development'

esbuild
  .build({
    watch: isDev && {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error)
        else console.log('watch build succeeded:', result)
      },
    },
    sourcemap: isDev,
    minify: !isDev,
    target: 'es2018',
    entryPoints: ['./src/main.tsx'],
    bundle: true,
    outdir: './output',
    plugins: [
      pnpPlugin(),
      postCssPlugin({
        plugins: [postCssNesting, postCssColorModFunction],
        modules: false,
      }),
    ],
  })
  .catch(() => process.exit(1))
