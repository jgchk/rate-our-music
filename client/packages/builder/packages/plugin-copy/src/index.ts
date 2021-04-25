import { promises as fs } from 'fs'
import path from 'path'
import { Plugin, asArray, getFullPath } from '@builder/core'

export type CopyPluginOptions = {
  files: string | string[]
}

export const copyPlugin = (options: CopyPluginOptions): Plugin => ({
  name: 'copy',
  setup: (build) => {
    const cwd = build.initialOptions?.cwd ?? process.cwd()
    const outdir = build.initialOptions?.outdir ?? cwd
    const files = asArray(options.files).map(getFullPath(cwd))

    build.onBuild({ filter: /.*/ }, async () => {
      await Promise.all(
        files.map(async (file) => {
          const dest = path.join(outdir, path.basename(file))
          await fs.mkdir(path.dirname(dest), { recursive: true })
          await fs.copyFile(file, dest)
        })
      )
      return { message: 'Files copied' }
    })
  },
})
