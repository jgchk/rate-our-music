export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined

export interface ClassDictionary {
  [id: string]: any
}

export type ClassArray = Array<ClassValue>

const toVal = (mix: ClassValue) => {
  let k,
    y,
    str = ''

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k] && (y = toVal(mix[k]))) {
          str && (str += ' ')
          str += y
        }
      }
    } else {
      for (k in mix) {
        if (mix?.[k]) {
          str && (str += ' ')
          str += k
        }
      }
    }
  }

  return str
}

export const clsx = (...args: ClassValue[]): string => {
  let i = 0,
    tmp,
    x,
    str = ''

  while (i < args.length) {
    if ((tmp = args[i++]) && (x = toVal(tmp))) {
      str && (str += ' ')
      str += x
    }
  }

  return str
}
