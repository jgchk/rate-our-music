const fs = require('fs')
const glob = require('glob')
const path = require('path')
const url = require('url')
const webpack = require('webpack')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const minify = require('html-minifier').minify
const webpackConfig = require('./webpack.config')

function insertBefore(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode)
}

function parseHTMLFiles({ buildDirectory }) {
  // Get all html files from the output folder
  const pattern = buildDirectory + '/**/*.html'
  const htmlFiles = glob
    .sync(pattern)
    .map((htmlPath) => path.relative(buildDirectory, htmlPath))

  const doms = {}
  const jsEntries = {}
  for (const htmlFile of htmlFiles) {
    const dom = new JSDOM(fs.readFileSync(path.join(buildDirectory, htmlFile)))

    //Find all local script, use it as the entrypoint
    const scripts = Array.from(dom.window.document.querySelectorAll('script'))
      .filter((el) => el.type.trim().toLowerCase() === 'module')
      .filter((el) => !/^[a-zA-Z]+:\/\//.test(el.src))

    for (const el of scripts) {
      const src = el.src.trim()
      const parsedPath = path.parse(src)
      const name = parsedPath.name
      if (!(name in jsEntries)) {
        jsEntries[name] = {
          path: path.join(buildDirectory, src),
          occurrences: [],
        }
      }
      jsEntries[name].occurrences.push({ script: el, dom })
    }

    doms[htmlFile] = dom
  }
  return { doms, jsEntries }
}

function emitHTMLFiles({
  doms,
  jsEntries,
  stats,
  baseUrl,
  buildDirectory,
  htmlMinifierOptions,
}) {
  const entrypoints = stats.toJson({ assets: false, hash: true }).entrypoints

  //Now that webpack is done, modify the html files to point to the newly compiled resources
  Object.keys(jsEntries).forEach((name) => {
    if (entrypoints[name] !== undefined && entrypoints[name]) {
      const assetFiles =
        entrypoints[name].assets.map((asset) => asset.name) || []
      const jsFiles = assetFiles.filter((d) => d.endsWith('.js'))
      const cssFiles = assetFiles.filter((d) => d.endsWith('.css'))

      for (const occurrence of jsEntries[name].occurrences) {
        const originalScriptEl = occurrence.script
        const dom = occurrence.dom
        const head = dom.window.document.querySelector('head')

        for (const jsFile of jsFiles) {
          // Clone node so we keep original attributes, and remove
          // `type=module` as that is not needed
          const scriptEl = originalScriptEl.cloneNode()
          scriptEl.removeAttribute('type')
          scriptEl.src = url.parse(baseUrl).protocol
            ? url.resolve(baseUrl, jsFile)
            : path.posix.join(baseUrl, jsFile)
          // insert _before_ so the relative order of these scripts is maintained
          insertBefore(scriptEl, originalScriptEl)
        }
        for (const cssFile of cssFiles) {
          const linkEl = dom.window.document.createElement('link')
          linkEl.setAttribute('rel', 'stylesheet')
          linkEl.href = url.parse(baseUrl).protocol
            ? url.resolve(baseUrl, cssFile)
            : path.posix.join(baseUrl, cssFile)
          head.append(linkEl)
        }
        originalScriptEl.remove()
      }
    }
  })

  //And write our modified html files out to the destination
  for (const [htmlFile, dom] of Object.entries(doms)) {
    const html = htmlMinifierOptions
      ? minify(dom.serialize(), htmlMinifierOptions)
      : dom.serialize()

    fs.writeFileSync(path.join(buildDirectory, htmlFile), html)
  }
}

function getPresetEnvTargets({ browserslist }) {
  if (Array.isArray(browserslist) || typeof browserslist === 'string') {
    return browserslist
  } else if (typeof browserslist === 'object' && 'production' in browserslist) {
    return browserslist.production
  } else {
    return '>0.75%, not ie 11, not UCAndroid >0, not OperaMini all'
  }
}

module.exports = function plugin(config, args = {}) {
  const htmlMinifierOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  }

  // Webpack handles minification for us, so its safe to always
  // disable Snowpack's default minifier.
  config.buildOptions.minify = false
  // Webpack creates unique file hashes for all generated bundles,
  // so we clean the build directory before building to remove outdated
  // build artifacts.
  config.buildOptions.clean = true

  return {
    name: '@snowpack/plugin-webpack',
    async optimize({ buildDirectory, log }) {
      const buildOptions = config.buildOptions || {}
      let baseUrl = buildOptions.baseUrl || '/'

      const { doms, jsEntries } = parseHTMLFiles({ buildDirectory })

      if (Object.keys(jsEntries).length === 0) {
        throw new Error("Can't bundle without script tag in html")
      }

      const extendedConfig = webpackConfig(buildDirectory, baseUrl, jsEntries)
      const compiler = webpack(extendedConfig)

      const stats = await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            reject(err)
            return
          }
          const info = stats.toJson(extendedConfig.stats)
          if (stats.hasErrors()) {
            console.error('Webpack errors:\n' + info.errors.join('\n-----\n'))
            reject(Error(`Webpack failed with ${info.errors} error(s).`))
            return
          }
          if (stats.hasWarnings()) {
            console.error(
              'Webpack warnings:\n' + info.warnings.join('\n-----\n')
            )
            if (args.failOnWarnings) {
              reject(Error(`Webpack failed with ${info.warnings} warnings(s).`))
              return
            }
          }
          resolve(stats)
        })
      })

      if (extendedConfig.stats !== 'none') {
        console.log(
          stats.toString(
            extendedConfig.stats
              ? extendedConfig.stats
              : {
                  colors: true,
                  all: false,
                  assets: true,
                }
          )
        )
      }

      emitHTMLFiles({
        doms,
        jsEntries,
        stats,
        baseUrl,
        buildDirectory,
        htmlMinifierOptions,
      })
    },
  }
}
