export type Datum<T, E> = Initial | Loading | Failed<E> | Success<T>
export type Initial = { type: 'initial' }
export type Loading = { type: 'loading' }
export type Failed<E> = { type: 'failed', error: E }
export type Success<T> = { type: 'success', data: T }

export const initial: Initial = { type: 'initial' };
export const loading: Loading = { type: 'loading' };
export const failed = <E>(error: E): Failed<E> => ({ type: 'failed', error });
export const success = <T>(data: T): Success<T> => ({ type: 'success', data });

export const isInitial = <T, E>(datum: Datum<T, E>): datum is Initial => datum.type === 'initial';
export const isLoading = <T, E>(datum: Datum<T, E>): datum is Loading => datum.type === 'loading';
export const isFailed = <T, E>(datum: Datum<T, E>): datum is Failed<E> => datum.type === 'failed';
export const isSuccess = <T, E>(datum: Datum<T, E>): datum is Success<T> => datum.type === 'success';
