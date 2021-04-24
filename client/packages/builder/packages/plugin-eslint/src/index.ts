import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { ESLint } from 'eslint'
import { ResultMessage, isError, isWarning, messageFormatter } from './utils'
import {
  FromThread,
  Plugin,
  ToThread,
  getFullPath,
  onBuildThreaded,
} from '@builder/core'

export type EslintPluginOptions = {
  cwd?: string
}

export const eslintPlugin = (options?: EslintPluginOptions): Plugin => ({
  name: 'eslint',
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
          `eslint stopped unexpectedly with exit code ${exitCode}`
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
})

if (!isMainThread) {
  const { options, cwd = process.cwd() } = workerData as {
    options: EslintPluginOptions | undefined
    cwd: string | undefined
  }
  const eslint = new ESLint({
    cwd: options?.cwd ? getFullPath(cwd)(options.cwd) : undefined,
    cache: true,
    // @ts-ignore
    cacheStrategy: 'content',
  })
  const formatMessage = messageFormatter(cwd)

  const listener = (message: ToThread) => {
    switch (message.fn) {
      case 'onBuild': {
        return void (async () => {
          const results = await eslint.lintFiles('.')

          const messages: ResultMessage[] = results.flatMap((result) =>
            result.messages.map((message) => ({ result, message }))
          )
          const warnings = messages.filter(isWarning).map(formatMessage)
          const errors = messages.filter(isError).map(formatMessage)

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
