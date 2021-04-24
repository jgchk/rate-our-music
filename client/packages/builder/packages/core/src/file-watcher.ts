import { watch } from 'chokidar'
import { asArray, getFullPath } from './utils'

export type FileWatcherArgs = {
  cwd?: string
  paths: string | string[]
  onChange: (files: string[]) => void
}

export type FileWatcher = {
  close: () => Promise<void>
}

export const FileWatcher = (args: FileWatcherArgs): FileWatcher => {
  const cwd = args.cwd ?? process.cwd()
  const paths = asArray(args.paths).map(getFullPath(cwd))

  let timeout: NodeJS.Timeout | undefined
  const changedFiles = new Set<string>()

  const watcher = watch(paths, { ignoreInitial: true, cwd: cwd }).on(
    'all',
    (_, path) => {
      changedFiles.add(path)

      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        args.onChange([...changedFiles])
        changedFiles.clear()
      })
    }
  )

  return {
    close: async () => {
      await watcher.close()
    },
  }
}
