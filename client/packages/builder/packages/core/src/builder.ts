import { promises as fs } from 'fs'
import path from 'path'
import { FileWatcher } from './file-watcher'
import { log } from './logger'
import { BuildFile, OnBuildResult, Plugin, PluginBuild } from './plugin'
import { isDefined } from './utils'

export type Builder = {
  close: () => Promise<void>
}

export type BuilderOptions = {
  cwd?: string
  plugins?: (Plugin | false)[]
  watch?: string | string[]
  entries?: string[]
  outdir?: string
  clean?: boolean
}

export type PluginOnBuildResult = OnBuildResult & { name: string }

export type RegisteredPlugin = {
  name: Plugin['name']
  onBuild?: {
    options: Parameters<PluginBuild['onBuild']>[0]
    callback: Parameters<PluginBuild['onBuild']>[1]
  }
  onBuilt?: {
    callback: Parameters<PluginBuild['onBuilt']>[0]
  }
  onClose?: {
    callback: Parameters<PluginBuild['onClose']>[0]
  }
}

const isPlugin = (plugin: Plugin | false): plugin is Plugin => !!plugin

export const Builder = async (options?: BuilderOptions): Promise<Builder> => {
  const { plugins, watch } = options ?? {}

  const onBuildComplete = async (result: PluginOnBuildResult) => {
    log(result)
    await write(result.files)

    await Promise.all(
      pluginRegistry.map(async (registeredPlugin) => {
        await registeredPlugin.onBuilt?.callback(result)
      })
    )
  }

  const write = (files?: BuildFile[]) =>
    Promise.all(
      (files ?? []).map(async (file) => {
        await fs.mkdir(path.dirname(file.path), { recursive: true })
        await fs.writeFile(file.path, file.content)
      })
    )

  const build = async (files?: string[]) => {
    if (watch !== undefined) {
      console.clear()
    }

    const results = (
      await Promise.all(
        pluginRegistry.map(async (plugin) => {
          const onBuild = plugin.onBuild
          if (onBuild === undefined) return

          const matchingFiles = files?.filter((file) =>
            onBuild.options.filter.test(file)
          )
          if (matchingFiles !== undefined && matchingFiles.length === 0) return

          const result = await onBuild.callback({ files: matchingFiles })
          const resultWithName = { ...result, name: plugin.name }

          await onBuildComplete(resultWithName)

          return resultWithName
        })
      )
    ).filter(isDefined)

    return results
  }

  const close = async () => {
    await Promise.all([
      watcher?.close(),
      ...pluginRegistry.map(async (registeredPlugin) => {
        await registeredPlugin.onClose?.callback()
      }),
    ])
  }

  const pluginRegistry: RegisteredPlugin[] = await Promise.all(
    (plugins ?? []).filter(isPlugin).map(async (plugin) => {
      const registeredPlugin: RegisteredPlugin = { name: plugin.name }
      await plugin.setup({
        initialOptions: options,
        onChange: (result) => onBuildComplete({ ...result, name: plugin.name }),
        onBuild: (options, callback) => {
          registeredPlugin.onBuild = { options, callback }
        },
        onBuilt: (callback) => {
          registeredPlugin.onBuilt = { callback }
        },
        onClose: (callback) => {
          registeredPlugin.onClose = { callback }
        },
      })
      return registeredPlugin
    })
  )

  if (options?.clean && options.outdir !== undefined) {
    await fs.rm(options.outdir, { recursive: true, force: true })
  }

  let watcher: FileWatcher | undefined
  if (watch !== undefined) {
    await build()
    watcher = FileWatcher({
      paths: watch,
      onChange: (files) => build(files),
    })
  } else {
    await build()
    await close()
  }

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      void close()
    })
  }

  return { close }
}
