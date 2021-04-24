export type EmptyObject = Record<string, never>

export type GenericObject<T = unknown> = { [key: string]: T }

export type GenericFunction<A = unknown, R = unknown> = (...args: A[]) => R
