const { Builder } = require('@builder/core')
const { esbuildPlugin } = require('@builder/plugin-esbuild')
const { typescriptPlugin } = require('@builder/plugin-typescript')
const { eslintPlugin } = require('@builder/plugin-eslint')
const { stylelintPlugin } = require('@builder/plugin-stylelint')
const { graphqlPlugin } = require('@builder/plugin-graphql')
const { devServerPlugin } = require('@builder/plugin-dev-server')

const { pnpPlugin } = require('@builder/esbuild-plugin-pnp')
const { postcssPlugin } = require('@builder/esbuild-plugin-postcss')
const postcssImport = require('postcss-import')

const args = process.argv.slice(2)
const isDev = args.includes('--dev')

process.env.NODE_ENV = isDev ? 'development' : 'production'

void Builder({
  cwd: __dirname,
  watch: isDev ? ['./src'] : undefined,
  entries: ['./src/main.tsx'],
  outdir: './output',
  clean: true,
  plugins: [
    esbuildPlugin({
      plugins: [pnpPlugin(), postcssPlugin({ plugins: [postcssImport()] })],
    }),
    typescriptPlugin(),
    eslintPlugin({ cwd: '../..' }),
    stylelintPlugin({ files: './src/**/*.css' }),
    graphqlPlugin({
      localSchemaPath: './src/generated/schema.graphql',
      remoteSchemaUrl: 'http://localhost:3030/graphql',
      documentsPath: 'src/**/*.graphql',
      outputPath: './src/generated/graphql.ts',
    }),
    isDev &&
      devServerPlugin({ html: './public/index.html', resources: './output' }),
  ],
})
