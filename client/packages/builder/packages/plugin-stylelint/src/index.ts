import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import * as stylelint from 'stylelint'
import { formatResult, isError, isWarning } from './utils'
import {
  FromThread,
  Plugin,
  ToThread,
  asArray,
  getFullPath,
  onBuildThreaded,
} from '@builder/core'

export type StylelintPluginOptions = {
  files: string | string[]
}

export const stylelintPlugin = (options: StylelintPluginOptions): Plugin => {
  return {
    name: 'stylelint',
    setup: (build) => {
      const worker = new Worker(__filename, {
        workerData: { options, cwd: build.initialOptions?.cwd },
      })

      worker.on('error', (error) => {
        throw error
      })
      worker.on('exit', (exitCode) => {
        if (exitCode !== 0)
          throw new Error(
            `stylelint stopped unexpectedly with exit code ${exitCode}`
          )
      })

      let messageId = 0

      build.onBuild(
        { filter: /\.css$/ },
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
    options: StylelintPluginOptions
    cwd: string | undefined
  }
  const files = asArray(options.files).map(getFullPath(cwd))

  const listener = (message: ToThread) => {
    switch (message.fn) {
      case 'onBuild': {
        return void (async () => {
          const { results } = await stylelint.lint({
            files: message.args.files ?? files,
          })

          const messages = results.flatMap((result) =>
            result.warnings.map((warning) => ({ result, warning }))
          )
          const errors = messages.filter(isError).map(formatResult)
          const warnings = messages.filter(isWarning).map(formatResult)

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
        })()
      }
      case 'shutdown': {
        return parentPort?.off('message', listener)
      }
    }
  }

  parentPort?.on('message', listener)
}
