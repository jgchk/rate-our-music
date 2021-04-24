import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import {
  diagnosticFormatter,
  getConfig,
  getDiagnostics,
  isError,
  isWarning,
} from './utils'
import { FromThread, Plugin, ToThread, onBuildThreaded } from '@builder/core'

export type TypescriptPluginOptions = {
  configPath?: string
}

export const typescriptPlugin = (options?: TypescriptPluginOptions): Plugin => {
  return {
    name: 'typescript',
    setup: (build) => {
      const worker = new Worker(__filename, {
        workerData: {
          options,
          cwd: build.initialOptions?.cwd,
        },
      })

      worker.on('error', (error) => {
        throw error
      })
      worker.on('exit', (exitCode) => {
        if (exitCode !== 0)
          throw new Error(
            `typescript stopped unexpectedly with exit code ${exitCode}`
          )
      })

      let messageId = 0

      build.onBuild(
        { filter: /\.(tsx?|css)$/ },
        onBuildThreaded(worker, () => messageId++)
      )

      build.onClose(() => {
        worker.postMessage(<ToThread>{ fn: 'shutdown' })
      })
    },
  }
}

if (!isMainThread) {
  const { options, cwd = process.cwd() } = workerData as {
    options: TypescriptPluginOptions | undefined
    cwd: string | undefined
  }
  const { configPath } = options ?? {}
  const config = getConfig(cwd, configPath)
  const formatDiagnostic = diagnosticFormatter(cwd)

  const listener = (message: ToThread) => {
    switch (message.fn) {
      case 'onBuild': {
        const diagnostics = getDiagnostics(config)

        const errors = diagnostics.filter(isError).map(formatDiagnostic)
        const warnings = diagnostics.filter(isWarning).map(formatDiagnostic)

        return parentPort?.postMessage(<FromThread>{
          id: message.id,
          fn: 'onBuild',
          result: {
            errors,
            warnings,
            message:
              errors.length > 0
                ? 'Found errors'
                : warnings.length > 0
                ? 'Found warnings'
                : 'No issues',
          },
        })
      }
      case 'shutdown': {
        return parentPort?.off('message', listener)
      }
    }
  }

  parentPort?.on('message', listener)
}
