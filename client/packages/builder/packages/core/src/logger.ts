import chalk from 'chalk'
import { PluginOnBuildResult } from './builder'
import { Issue, Location } from './plugin'

const Icon = {
  ERROR: '⨉',
  WARNING: '⚠',
  INFO: '🛈',
} as const

const Color = {
  ERROR: chalk.red,
  WARNING: chalk.yellow,
  INFO: chalk,
} as const

const Box = {
  LINE: '│',
  CORNER: '└',
}

type Msg = Issue & { _type: 'error' | 'warning' }

const hasTwoLines = (
  msg: Msg
): msg is Msg & {
  location: Location & {
    column: NonNullable<Location['column']>
    length: NonNullable<Location['length']>
    lineText: NonNullable<Location['lineText']>
  }
} => {
  const { column, length, lineText } = msg.location ?? {}
  return column !== undefined && length !== undefined && lineText !== undefined
}

export const log = (result: PluginOnBuildResult): void => {
  let output = ''
  output += Icon.INFO
  output += '  '
  output += chalk.bold(`[${result.name}]`)
  if (result.message) {
    output += ` ${result.message}`
  }
  console.log(output)

  const msgs = [
    ...(result.errors ?? []).map((error) => ({
      ...error,
      _type: 'error' as const,
    })),
    ...(result.warnings ?? []).map((warning) => ({
      ...warning,
      _type: 'warning' as const,
    })),
  ]

  for (const [i, msg] of msgs.entries()) {
    const isLast = i === msgs.length - 1

    const icon = msg._type === 'error' ? Icon.ERROR : Icon.WARNING
    const color = msg._type === 'error' ? Color.ERROR : Color.WARNING

    let line1 = ''
    line1 += chalk.dim(
      isLast ? (hasTwoLines(msg) ? Box.LINE : Box.CORNER) : Box.LINE
    )
    line1 += '   '
    line1 += color(icon)
    line1 += '  '

    if (msg.location !== undefined) {
      const { file, line, column } = msg.location
      if (file !== undefined) {
        line1 += chalk.bold(color(file))

        if (line !== undefined) {
          line1 += chalk.bold(color(`:${line}`))

          if (column !== undefined) {
            line1 += chalk.bold(color(`:${column}`))
          }
        }

        line1 += chalk.bold(color(': '))
      }
    }

    line1 += msg.text
    console.log(line1)

    if (hasTwoLines(msg)) {
      let line2 = ''
      line2 += chalk.dim(isLast ? Box.CORNER : Box.LINE)
      line2 += '      '

      const { column, length, lineText } = msg.location
      const end = column + length
      line2 +=
        chalk.dim(lineText.slice(0, column)) +
        chalk.green(lineText.slice(column, end)) +
        chalk.dim(lineText.slice(end))

      console.log(line2)
    }
  }
}
