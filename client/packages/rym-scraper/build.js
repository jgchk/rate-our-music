const { Builder } = require('@builder/core')
const { esbuildPlugin } = require('@builder/plugin-esbuild')
const { typescriptPlugin } = require('@builder/plugin-typescript')
const { eslintPlugin } = require('@builder/plugin-eslint')
const { copyPlugin } = require('@builder/plugin-copy')

const args = process.argv.slice(2)
const isDev = args.includes('--dev')

void Builder({
  cwd: __dirname,
  watch: isDev ? ['./src'] : undefined,
  entries: ['./src/release/index.ts', './src/background/index.ts'],
  outdir: './output',
  clean: true,
  plugins: [
    esbuildPlugin(),
    typescriptPlugin(),
    eslintPlugin({ cwd: '../..' }),
    copyPlugin({ files: ['./manifest.json', './src/background/popup.html'] }),
  ],
})
