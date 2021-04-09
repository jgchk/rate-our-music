import { Plugin } from 'esbuild'
import { Plugin as PostCSSPlugin } from 'postcss'
import { ensureDir, readFile, writeFile } from 'fs-extra'
import path from 'path'
import tmp from 'tmp'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'

interface PostCSSPluginOptions {
  plugins: PostCSSPlugin[]
  modules: boolean | any
  rootDir?: string
}

interface CSSModule {
  path: string
  map: {
    [key: string]: string
  }
}

const postCSSPlugin = ({
  plugins = [],
  modules = true,
  rootDir = process.cwd(),
}: PostCSSPluginOptions): Plugin => ({
  name: 'postcss',
  setup(build) {
    // get a temporary path where we can save compiled CSS
    const tmpDirPath = tmp.dirSync().name
    const modulesMap: CSSModule[] = []

    const modulesPlugin = postcssModules({
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      ...(typeof modules !== 'boolean' ? modules : {}),
      getJSON(
        filepath: string,
        json: { [key: string]: string },
        outpath: string
      ) {
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

      const sourceFullPath = path.resolve(args.resolveDir, args.path)

      const sourceExt = path.extname(sourceFullPath)
      const sourceBaseName = path.basename(sourceFullPath, sourceExt)
      const sourceDir = path.dirname(sourceFullPath)
      const sourceRelDir = path.relative(path.dirname(rootDir), sourceDir)
      const isModule = sourceBaseName.match(/\.module$/)
      const tmpDir = path.resolve(tmpDirPath, sourceRelDir)

      let tmpCssFilePath = path.resolve(
        tmpDir,
        `${Date.now()}-${sourceBaseName.replace('.module', '.processed')}.css`
      )
      let tmpJsFilePath = path.resolve(
        tmpDir,
        `${Date.now()}-${sourceBaseName}.js`
      )

      // When CSS is an entry-point we don't want to append Date.now()
      if (args.kind === 'entry-point') {
        tmpCssFilePath = path.resolve(
          tmpDir,
          `${sourceBaseName.replace('.module', '.processed')}.css`
        )
        tmpJsFilePath = path.resolve(tmpDir, `${sourceBaseName}.js`)
      }

      await ensureDir(tmpDir)

      const fileContent = await readFile(sourceFullPath)
      let css = sourceExt === '.css' ? fileContent : ''

      // wait for plugins to complete parsing & get result
      const result = await postcss(
        isModule ? [modulesPlugin, ...plugins] : plugins
      ).process(css, {
        from: sourceFullPath,
        to: tmpCssFilePath,
      })

      // Write result CSS
      await writeFile(tmpCssFilePath, result.css)

      if (isModule) {
        const mod = modulesMap.find(({ path }) => path === sourceFullPath)
        const jsFile = `import ${JSON.stringify(tmpCssFilePath)};
          export default ${JSON.stringify(mod && mod.map ? mod.map : {})};`
        await writeFile(tmpJsFilePath, jsFile)
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

export default postCSSPlugin
