import { EmptyObject, GenericObject } from '../utils/types'

// Base param type
export type ParamType<T> = {
  // Convert string to param type. May return undefined if type is invalid.
  parse(s: string): T | undefined

  // Convert param to string, for use in path
  stringify(t: T): string
}

export const str: ParamType<string> = {
  parse: (s) => s,
  stringify: (t) => t,
}

export const int: ParamType<number> = {
  parse: (s) => {
    const ret = Number.parseInt(s)
    return Number.isNaN(ret) ? undefined : ret
  },
  stringify: (t) => t.toString(),
}

export const float: ParamType<number> = {
  parse: (s) => {
    const ret = Number.parseFloat(s)
    return Number.isNaN(ret) ? undefined : ret
  },
  stringify: (t) => t.toString(),
}

export const dateTime: ParamType<Date> = {
  parse: (s) => {
    const ret = new Date(Number.parseInt(s))
    return Number.isNaN(ret.getTime()) ? undefined : ret
  },
  stringify: (d) => d.getTime().toString(),
}

export const array = <T>(p: ParamType<T>, delimiter = ','): ParamType<T[]> => ({
  parse: (s) => {
    const ret: T[] = []
    if (s) {
      const parts = s.split(delimiter)
      for (const part of parts) {
        const t = p.parse(part)
        if (t === undefined) return
        ret.push(t)
      }
    }
    return ret
  },
  stringify: (t): string => t.map((i) => p.stringify(i)).join(delimiter),
})

export type Options = {
  // What kind of "slash" separates paths?
  delimiter: string

  // What does path start with?
  prefix: string

  // What does path endwith
  suffix: string
}

const defaultOptions: Options = {
  delimiter: '/',
  prefix: '/',
  suffix: '',
}

export type Part = string | Param<unknown>

export type Param<T = string> = {
  _type: 'param'
  name: string
  paramType: ParamType<T>
}

const isParam = <T>(part: Part): part is Param<T> => typeof part === 'object'

export type MapParam<K extends string, T> = { [P in K]: T }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Route<T> = {
  options: Options
  parts: Part[]
}

export type Matcher<P> = (str: string) => P | undefined

export type TypeOf<M extends Matcher<unknown>> = NonNullable<ReturnType<M>>

export const route = (options: Partial<Options> = {}): Route<EmptyObject> => ({
  options: { ...defaultOptions, ...options },
  parts: [],
})

const add = (part: Part) => <P>(route: Route<P>) => ({
  ...route,
  parts: [...route.parts, part],
})

export const extend = (...names: string[]) => <P>(route: Route<P>): Route<P> =>
  names.reduce((r, curr) => add(curr)(r), route)

export const param = <K extends string, T = string>(
  name: K,
  paramType?: ParamType<T>
) => <P>(route: Route<P>): Route<P & MapParam<K, T>> =>
  add({ _type: 'param', name, paramType: paramType ?? str })(route)

export const match = <P>(route: Route<P>): Matcher<P> => (str) => {
  const { delimiter, prefix, suffix } = route.options
  if (str.startsWith(prefix)) {
    str = str.slice(prefix.length)
  } else {
    return
  }

  if (str.endsWith(suffix)) {
    str = str.slice(0, str.length - suffix.length)
  } else {
    return
  }

  const params: GenericObject = {}
  const strParts = str.split(delimiter)

  if (strParts.length !== route.parts.length) return

  for (const part of route.parts) {
    // we know strPart will never be undefined since we did the length equality check above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const strPart = strParts.shift()!

    // if param, assign param to key
    if (isParam(part)) {
      const paramValue = part.paramType.parse(strPart)
      // reject if parsing fails
      if (paramValue === undefined) return
      // add to params if parsing succeeds
      params[part.name] = paramValue
    }
    // string, just check if it's equal
    else if (strPart !== part) {
      return
    }
  }

  return (params as unknown) as P
}
