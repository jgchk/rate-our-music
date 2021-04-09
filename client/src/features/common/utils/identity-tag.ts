export const identity = (
  strings: TemplateStringsArray,
  ...args: unknown[]
): string => [...strings, ...args.map((arg) => String(arg))].join('\n')

export default identity
