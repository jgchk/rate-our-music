const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer({ target: 'http://localhost:3030' })

const development = process.env.NODE_ENV === 'development'

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  routes: [
    {
      src: '/graphql',
      dest: (req, res) => proxy.web(req, res),
    },
    {
      match: 'routes',
      src: '.*',
      dest: 'index.html',
    },
  ],
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  },
  plugins: [
    // ['@snowpack/plugin-typescript', { tsc: 'yarn tsc' }],
    [
      '@snowpack/plugin-babel',
      {
        input: ['.js', '.mjs', '.jsx', '.ts', '.tsx'], // (optional) specify files for Babel to transform
        transformOptions: {
          // babel transform options
        },
      },
    ],
    '@snowpack/plugin-postcss',
    ...(development
      ? [
          [
            '@canarise/snowpack-eslint-plugin',
            {
              globs: ['src/**/*.ts', 'src/**/*.tsx'],
              options: { cacheStrategy: 'content' },
            },
          ],
          '@prefresh/snowpack',
        ]
      : ['./snowpack-plugin/plugin.js']),
  ],
}
