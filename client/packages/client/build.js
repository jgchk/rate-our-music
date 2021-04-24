const { Builder } = require('@builder/core')
const { esbuildPlugin } = require('@builder/plugin-esbuild')
const { typescriptPlugin } = require('@builder/plugin-typescript')
const { eslintPlugin } = require('@builder/plugin-eslint')
const { stylelintPlugin } = require('@builder/plugin-stylelint')
const { graphqlPlugin } = require('@builder/plugin-graphql')
const { devServerPlugin } = require('@builder/plugin-dev-server')

const args = process.argv.slice(2)
const isDev = args.includes('--dev')

void Builder({
  cwd: __dirname,
  watch: isDev ? ['./src'] : undefined,
  entries: ['./src/main.tsx'],
  outdir: './output',
  clean: true,
  plugins: [
    esbuildPlugin(),
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
