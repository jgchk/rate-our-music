import { BuildIncremental, BuildOptions, build as esbuild } from 'esbuild'
import colorModFunctionPlugin from 'postcss-color-mod-function'
import nestingPlugin from 'postcss-nesting'
import { pnpPlugin } from './pnp-plugin'
import { postcssPlugin } from './postcss-plugin'
import { errorHandler, formatBuildResult, isBuildIncremental } from './utils'
import { BuilderOptions, Plugin } from '@builder/core'

const baseOptions = (initialOptions?: BuilderOptions): BuildOptions => ({
  absWorkingDir: initialOptions?.cwd,
  logLevel: 'silent',
  target: 'es2018',
  entryPoints: initialOptions?.entries,
  bundle: true,
  outdir: initialOptions?.outdir,
  plugins: [
    pnpPlugin(),
    postcssPlugin({
      plugins: [nestingPlugin, colorModFunctionPlugin],
    }),
  ],
})

export const esbuildPlugin = (): Plugin => ({
  name: 'esbuild',
  setup: (build) => {
    if (build.initialOptions?.watch === undefined) {
      build.onBuild({ filter: /\.(tsx?|css)$/ }, async () => {
        const buildResult = await esbuild({
          ...baseOptions(build.initialOptions),
          write: false,
          minify: true,
        }).catch(errorHandler)

        return formatBuildResult(buildResult)
      })
    } else {
      let incrementalBuild: BuildIncremental | undefined

      build.onClose(() => {
        incrementalBuild?.rebuild.dispose()
      })

      build.onBuild({ filter: /\.(tsx?|css)$/ }, async () => {
        const buildResult =
          incrementalBuild?.rebuild !== undefined
            ? await incrementalBuild.rebuild().catch(errorHandler)
            : await esbuild({
                ...baseOptions(build.initialOptions),
                write: false,
                incremental: true,
                sourcemap: true,
              }).catch(errorHandler)

        if (isBuildIncremental(buildResult)) {
          incrementalBuild = buildResult
        }

        return formatBuildResult(buildResult)
      })
    }
  },
})
