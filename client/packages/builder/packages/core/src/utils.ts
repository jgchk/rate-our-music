import path from 'path'

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined

export const getFullPath = (cwd: string) => (path_: string): string =>
  path.isAbsolute(path_) ? path_ : path.join(cwd, path_)

export const asArray = <T>(t: T | T[]): T[] => (Array.isArray(t) ? t : [t])

export const promisify = async <T>(p: T | Promise<T>): Promise<T> => p
