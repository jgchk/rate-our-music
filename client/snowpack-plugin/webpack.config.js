const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = (buildDirectory, baseUrl, jsEntries) => {
  let entry = {}
  for (name in jsEntries) {
    entry[name] = jsEntries[name].path
  }

  return {
    context: buildDirectory,
    entry,
    output: {
      path: buildDirectory,
      publicPath: baseUrl,
      filename: 'js/[name].[contenthash].js',
    },
    resolve: {
      alias: {
        // TODO: Support a custom config.buildOptions.metaUrlPath
        '/_snowpack': path.join(buildDirectory, '_snowpack'),
        '/__snowpack__': path.join(buildDirectory, '__snowpack__'),
        '/web_modules': path.join(buildDirectory, 'web_modules'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('./plugins/import-meta-fix.js'),
            },
            {
              loader: require.resolve('./plugins/proxy-import-resolve.js'),
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.module\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /.*/,
          exclude: [/\.js?$/, /\.json?$/, /\.css$/],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name]-[hash].[ext]',
              },
            },
          ],
        },
      ],
    },
    mode: 'production',
    optimization: {
      // extract webpack runtime to its own chunk: https://webpack.js.org/concepts/manifest/#runtime
      runtimeChunk: {
        name: `webpack-runtime`,
      },
      splitChunks: getSplitChunksConfig({
        numEntries: Object.keys(jsEntries).length,
      }),
      minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin()],
    },
    plugins: [
      //Extract a css file from imported css files
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
      }),
    ],
  }
}

function getSplitChunksConfig({ numEntries }) {
  const isCss = (module) => module.type === `css/mini-extract`
  /**
   * Implements a version of granular chunking, as described at https://web.dev/granular-chunking-nextjs/.
   */
  return {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      default: false,
      vendors: false,
      /**
       * NPM libraries larger than 100KB are pulled into their own chunk
       *
       * We use a smaller cutoff than the reference implementation (which does 150KB),
       * because our babel-loader config compresses whitespace with `compact: true`.
       */
      lib: {
        test(module) {
          return (
            !isCss(module) &&
            module.size() > 100000 &&
            /_snowpack[/\\]pkg[/\\]/.test(module.identifier())
          )
        },
        name(module) {
          /**
           * Name the chunk based on the filename in /pkg/*.
           *
           * E.g. /pkg/moment.js -> lib-moment.HASH.js
           */
          const ident = module.libIdent({ context: 'dir' })
          const lastItem = ident
            .split('/')
            .reduceRight((item) => item)
            .replace(/\.js$/, '')
          return `lib-${lastItem}`
        },
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true,
      },
      // modules used by all entrypoints end up in commons
      commons: {
        test(module) {
          return !isCss(module)
        },
        name: 'commons',
        // don't create a commons chunk until there are 2+ entries
        minChunks: Math.max(2, numEntries),
        priority: 20,
      },
      // modules used by multiple chunks can be pulled into shared chunks
      shared: {
        test(module) {
          return !isCss(module)
        },
        name(module, chunks) {
          const hash = crypto
            .createHash(`sha1`)
            .update(chunks.reduce((acc, chunk) => acc + chunk.name, ``))
            .digest(`hex`)

          return hash
        },
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
      },
      // Bundle all css & lazy css into one stylesheet to make sure lazy components do not break
      styles: {
        test(module) {
          return isCss(module)
        },
        name: `styles`,
        priority: 40,
        enforce: true,
      },
    },
  }
}
