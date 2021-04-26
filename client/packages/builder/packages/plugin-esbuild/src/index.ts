import {
  BuildIncremental,
  BuildOptions,
  Plugin as EsbuildPlugin,
  build as esbuild,
} from 'esbuild'
import { errorHandler, formatBuildResult, isBuildIncremental } from './utils'
import { BuilderOptions, Plugin } from '@builder/core'

export type EsbuildPluginOptions = {
  plugins?: EsbuildPlugin[]
}

const baseOptions = (
  initialOptions?: BuilderOptions,
  pluginOptions?: EsbuildPluginOptions
): BuildOptions => ({
  absWorkingDir: initialOptions?.cwd,
  logLevel: 'silent',
  target: 'es2018',
  entryPoints: initialOptions?.entries,
  bundle: true,
  outdir: initialOptions?.outdir,
  plugins: pluginOptions?.plugins,
})

export const esbuildPlugin = (options?: EsbuildPluginOptions): Plugin => ({
  name: 'esbuild',
  setup: (build) => {
    if (build.initialOptions?.watch === undefined) {
      build.onBuild({ filter: /\.(tsx?|css)$/ }, async () => {
        const buildResult = await esbuild({
          ...baseOptions(build.initialOptions, options),
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
                ...baseOptions(build.initialOptions, options),
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
