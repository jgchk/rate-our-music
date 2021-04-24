import { LintResult, Warning } from 'stylelint'
import { Issue } from '@builder/core'

export type ResultWarning = {
  result: LintResult
  warning: Warning
}

export const isError = ({ warning }: ResultWarning): boolean =>
  warning.severity === 'error'
export const isWarning = ({ warning }: ResultWarning): boolean =>
  warning.severity === 'warning'

export const formatResult = ({ result, warning }: ResultWarning): Issue => {
  const lines = result.source.split('\n')
  return {
    text: warning.text,
    location: {
      line: warning.line,
      column: warning.column,
      lineText: lines[warning.line],
    },
  }
}
