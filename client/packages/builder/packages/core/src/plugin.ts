import { Worker } from 'worker_threads'
import { BuilderOptions, PluginOnBuildResult } from './builder'

export type Plugin = {
  name: string
  setup: (build: PluginBuild) => void | Promise<void>
}

export type PluginBuild = {
  initialOptions?: BuilderOptions
  onChange?: (result: OnBuildResult) => void
  onBuild(
    options: OnBuildOptions,
    callback: (args: OnBuildArgs) => OnBuildResult | Promise<OnBuildResult>
  ): void
  onBuilt(callback: (result: PluginOnBuildResult) => void | Promise<void>): void
  onClose(callback: () => void | Promise<void>): void
}

export type OnBuildOptions = {
  filter: RegExp
}

export type OnBuildArgs = {
  files?: string[]
}

export type OnBuildResult = {
  message?: string
  errors?: Issue[]
  warnings?: Issue[]
  files?: BuildFile[]
}

export type Issue = {
  text: string
  location?: Location
}

export type Location = {
  file?: string
  line?: number
  column?: number
  length?: number
  lineText?: string
}

export type BuildFile = {
  path: string
  content: string
}

export type ToThread =
  | { id: number; fn: 'onBuild'; args: OnBuildArgs }
  | { fn: 'shutdown' }

export type FromThread = { id: number; fn: 'onBuild'; result: OnBuildResult }

export const onBuildThreaded = (worker: Worker, getId: () => number) => (
  args: OnBuildArgs
): Promise<OnBuildResult> =>
  new Promise((resolve) => {
    const id = getId()

    const listener = (message: FromThread) => {
      if (message.id === id) {
        resolve(message.result)
        worker.off('message', listener)
      }
    }

    worker.on('message', listener)

    worker.postMessage(<ToThread>{ id, fn: 'onBuild', args })
  })
