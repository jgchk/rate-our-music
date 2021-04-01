const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer({ target: 'http://localhost:3030' })

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
  ],
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  },
  buildOptions: {
    jsxInject: "import { h } from 'preact'",
  },
  plugins: [
    ['@snowpack/plugin-typescript', { tsc: 'yarn tsc' }],
    [
      '@canarise/snowpack-eslint-plugin',
      { globs: ['src/**/*.ts', 'src/**/*.tsx'] },
    ],
    '@snowpack/plugin-postcss',
    '@prefresh/snowpack',
  ],
  optimize: {
    minify: true,
    target: 'es2017',
  },
}
