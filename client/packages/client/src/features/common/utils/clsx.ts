export type ClassValue = string | false | undefined

export const clsx = (...args: ClassValue[]): string =>
  args.filter((arg) => !!arg).join(' ')
