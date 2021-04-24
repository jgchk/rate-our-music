import { TextDecoder } from 'util'
import {
  BuildFailure,
  BuildIncremental,
  BuildResult,
  OutputFile,
} from 'esbuild'
import { OnBuildResult } from '@builder/core'

export const isBuildIncremental = (
  build:
    | BuildIncremental
    | BuildFailure
    | (BuildResult & { outputFiles: OutputFile[] })
): build is BuildIncremental => 'rebuild' in build && !!build.rebuild
const isBuildFailure = (
  build:
    | BuildIncremental
    | BuildFailure
    | (BuildResult & { outputFiles: OutputFile[] })
): build is BuildFailure => 'errors' in build && !!build.errors
const isErrorBuildFailure = (error: unknown): error is BuildFailure =>
  typeof error === 'object' &&
  !!error &&
  'errors' in error &&
  'warnings' in error

export const errorHandler = (error: unknown): BuildFailure => {
  if (isErrorBuildFailure(error)) return error
  throw error
}

export const formatBuildResult = (
  buildResult:
    | BuildIncremental
    | BuildFailure
    | (BuildResult & { outputFiles: OutputFile[] })
): OnBuildResult => ({
  message: isBuildFailure(buildResult) ? 'Build failed' : 'Build succeeded',
  errors: isBuildFailure(buildResult)
    ? buildResult.errors.map((error) => ({
        text: error.text,
        location: error.location ?? undefined,
      }))
    : [],
  warnings: buildResult.warnings.map((warning) => ({
    text: warning.text,
    location: warning.location ?? undefined,
  })),
  files: isBuildFailure(buildResult)
    ? []
    : buildResult.outputFiles?.map((file) => ({
        path: file.path,
        content: new TextDecoder().decode(file.contents),
      })),
})
