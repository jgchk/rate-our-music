import {
  Diagnostic,
  ParsedCommandLine,
  createProgram,
  findConfigFile,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript'
import { Issue, Location } from '@builder/core'

export const getConfig = (
  cwd: string,
  configPath?: string
): ParsedCommandLine => {
  const configPath_ =
    configPath === undefined
      ? findConfigFile(cwd, sys.fileExists.bind(this), 'tsconfig.json')
      : configPath
  if (configPath_ === undefined) throw new Error('tsconfig.json not found')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { config } = readConfigFile(configPath_, sys.readFile.bind(this))
  return parseJsonConfigFileContent(config, sys, cwd)
}

export const getDiagnostics = (
  config: ParsedCommandLine
): readonly Diagnostic[] =>
  getPreEmitDiagnostics(
    createProgram({
      options: config.options,
      rootNames: config.fileNames,
      configFileParsingDiagnostics: config.errors,
    })
  )

export const isError = (diagnostic: Diagnostic): boolean =>
  diagnostic.category === 1
export const isWarning = (diagnostic: Diagnostic): boolean =>
  diagnostic.category === 2

export const diagnosticFormatter = (cwd: string) => (
  diagnostic: Diagnostic
): Issue => {
  const text = flattenDiagnosticMessageText(diagnostic.messageText, '\n', 2)

  let location: Location | undefined
  if (diagnostic.file !== undefined) {
    location = { file: diagnostic.file?.fileName.replace(cwd, '') }

    if (diagnostic.start !== undefined) {
      const lineChar = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      )
      const lineStart = diagnostic.file.getLineStarts()[lineChar.line]

      if (lineStart !== undefined) {
        const lineEnd = diagnostic.file.getLineEndOfPosition(diagnostic.start)
        const lineText = diagnostic.file.text.slice(lineStart, lineEnd)

        location.line = lineChar.line + 1
        location.column = lineChar.character
        location.length = diagnostic.length
        location.lineText = lineText
      }
    }
  }

  return { text, location }
}
