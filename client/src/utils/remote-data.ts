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

export const fold = <E, A, B>(
  onInitial: () => B,
  onLoading: () => B,
  onFailure: (error: E) => B,
  onSuccess: (data: A) => B
) => (remoteData: RemoteData<E, A>): B => {
  switch (remoteData._type) {
    case 'initial':
      return onInitial()
    case 'loading':
      return onLoading()
    case 'failure':
      return onFailure(remoteData.error)
    case 'success':
      return onSuccess(remoteData.data)
  }
}

export const map = <A, B>(fn: (a: A) => B) => <E>(
  remoteData: RemoteData<E, A>
): RemoteData<E, B> =>
  fold<E, A, RemoteData<E, B>>(
    () => initial,
    () => loading,
    (error) => failure(error),
    (data) => success(fn(data))
  )(remoteData)
