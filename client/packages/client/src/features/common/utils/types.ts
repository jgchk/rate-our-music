export type EmptyObject = Record<string, never>
export const isEmptyObject = (obj: unknown): obj is EmptyObject =>
  typeof obj === 'object' && !!obj && Object.entries(obj).length === 0

export type GenericObject<T = unknown> = { [key: string]: T }

export type GenericFunction<A = unknown, R = unknown> = (...args: A[]) => R
