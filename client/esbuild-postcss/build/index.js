'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const fs_extra_1 = require('fs-extra')
const path_1 = __importDefault(require('path'))
const tmp_1 = __importDefault(require('tmp'))
const postcss_1 = __importDefault(require('postcss'))
const postcss_modules_1 = __importDefault(require('postcss-modules'))
const postCSSPlugin = ({
  plugins = [],
  modules = true,
  rootDir = process.cwd(),
}) => ({
  name: 'postcss',
  setup(build) {
    // get a temporary path where we can save compiled CSS
    const tmpDirPath = tmp_1.default.dirSync().name
    const modulesMap = []
    const modulesPlugin = postcss_modules_1.default({
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      ...(typeof modules !== 'boolean' ? modules : {}),
      getJSON(filepath, json, outpath) {
        // Make sure to replace json map instead of pushing new map everytime with edit file on watch
        const mapIndex = modulesMap.findIndex((m) => m.path === filepath)
        if (mapIndex !== -1) {
          modulesMap[mapIndex].map = json
        } else {
          modulesMap.push({
            path: filepath,
            map: json,
          })
        }
        if (
          typeof modules !== 'boolean' &&
          typeof modules.getJSON === 'function'
        )
          return modules.getJSON(filepath, json, outpath)
      },
    })
    build.onResolve({ filter: /\.css$/ }, async (args) => {
      // Namespace is empty when using CSS as an entrypoint
      if (args.namespace !== 'file' && args.namespace !== '') return
      if (args.path.includes('.processed.css'))
        return {
          namespace: 'file',
          path: args.path,
        }
      const sourceFullPath = path_1.default.resolve(args.resolveDir, args.path)
      const sourceExt = path_1.default.extname(sourceFullPath)
      const sourceBaseName = path_1.default.basename(sourceFullPath, sourceExt)
      const sourceDir = path_1.default.dirname(sourceFullPath)
      const sourceRelDir = path_1.default.relative(
        path_1.default.dirname(rootDir),
        sourceDir
      )
      const isModule = sourceBaseName.match(/\.module$/)
      const tmpDir = path_1.default.resolve(tmpDirPath, sourceRelDir)
      let tmpCssFilePath = path_1.default.resolve(
        tmpDir,
        `${Date.now()}-${sourceBaseName.replace('.module', '.processed')}.css`
      )
      let tmpJsFilePath = path_1.default.resolve(
        tmpDir,
        `${Date.now()}-${sourceBaseName}.js`
      )
      // When CSS is an entry-point we don't want to append Date.now()
      if (args.kind === 'entry-point') {
        tmpCssFilePath = path_1.default.resolve(
          tmpDir,
          `${sourceBaseName.replace('.module', '.processed')}.css`
        )
        tmpJsFilePath = path_1.default.resolve(tmpDir, `${sourceBaseName}.js`)
      }
      await fs_extra_1.ensureDir(tmpDir)
      const fileContent = await fs_extra_1.readFile(sourceFullPath)
      let css = sourceExt === '.css' ? fileContent : ''
      // wait for plugins to complete parsing & get result
      const result = await postcss_1
        .default(isModule ? [modulesPlugin, ...plugins] : plugins)
        .process(css, {
          from: sourceFullPath,
          to: tmpCssFilePath,
        })
      // Write result CSS
      await fs_extra_1.writeFile(tmpCssFilePath, result.css)
      if (isModule) {
        const mod = modulesMap.find(({ path }) => path === sourceFullPath)
        const jsFile = `import ${JSON.stringify(tmpCssFilePath)};
          export default ${JSON.stringify(mod && mod.map ? mod.map : {})};`
        await fs_extra_1.writeFile(tmpJsFilePath, jsFile)
      }
      return {
        namespace: 'file',
        path: isModule ? tmpJsFilePath : tmpCssFilePath,
        watchFiles: [sourceFullPath],
        pluginData: {
          originalPath: sourceFullPath,
        },
      }
    })
  },
})
exports.default = postCSSPlugin
