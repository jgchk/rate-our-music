export type Result<E, T> = Err<E> | Ok<T>
export type Err<E> = { _type: 'err'; error: E }
export type Ok<T> = { _type: 'ok'; data: T }

export const err = <E>(error: E): Err<E> => ({ _type: 'err', error })
export const ok = <T>(data: T): Ok<T> => ({ _type: 'ok', data })

export const isErr = <E, T>(result: Result<E, T>): result is Err<E> =>
  result._type === 'err'
export const isOk = <E, T>(result: Result<E, T>): result is Ok<T> =>
  result._type === 'ok'
