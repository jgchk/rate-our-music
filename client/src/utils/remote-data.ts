export type RemoteData<E, T> = Initial | Loading | Failure<E> | Success<T>
export type Initial = { _type: 'initial' }
export type Loading = { _type: 'loading' }
export type Failure<E> = { _type: 'failure'; error: E }
export type Success<T> = { _type: 'success'; data: T }

export const initial: Initial = { _type: 'initial' }
export const loading: Loading = { _type: 'loading' }
export const failure = <E>(error: E): Failure<E> => ({
  _type: 'failure',
  error,
})
export const success = <T>(data: T): Success<T> => ({ _type: 'success', data })

export const isInitial = <E, T>(
  remoteData: RemoteData<E, T>
): remoteData is Initial => remoteData._type === 'initial'
export const isLoading = <E, T>(
  remoteData: RemoteData<E, T>
): remoteData is Loading => remoteData._type === 'loading'
export const isFailure = <E, T>(
  remoteData: RemoteData<E, T>
): remoteData is Failure<E> => remoteData._type === 'failure'
export const isSuccess = <E, T>(
  remoteData: RemoteData<E, T>
): remoteData is Success<T> => remoteData._type === 'success'
