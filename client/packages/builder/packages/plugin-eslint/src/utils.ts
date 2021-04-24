import { ESLint, Linter } from 'eslint'
import { Issue } from '@builder/core'

export type ResultMessage = {
  result: ESLint.LintResult
  message: Linter.LintMessage
}

export const isError = ({ message }: ResultMessage): boolean =>
  message.severity === 2
export const isWarning = ({ message }: ResultMessage): boolean =>
  message.severity === 1

export const messageFormatter = (cwd: string) => ({
  result,
  message,
}: ResultMessage): Issue => {
  let length
  if (message.endColumn !== undefined && message.endLine === message.line) {
    length = message.endColumn - message.column
  }

  const lines = result.source ? result.source.split('\n') : []
  const lineText = lines[message.line - 1]

  return {
    text: message.message,
    location: {
      file: result.filePath.replace(cwd + '/', ''),
      line: message.line,
      column: message.column - 1,
      length,
      lineText,
    },
  }
}
