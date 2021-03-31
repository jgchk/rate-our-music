const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer({ target: 'http://localhost:3030' })

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    ['@snowpack/plugin-typescript', { tsc: 'yarn tsc' }],
    '@snowpack/plugin-postcss',
    '@prefresh/snowpack',
  ],
  packageOptions: {},
  devOptions: {},
  buildOptions: {
    jsxInject: "import { h } from 'preact'",
  },
  optimize: {
    minify: true,
    target: 'es2017',
  },
  routes: [{ src: '/graphql', dest: (req, res) => proxy.web(req, res) }],
}
