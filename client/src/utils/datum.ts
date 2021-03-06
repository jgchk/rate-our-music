export type Initial = { type: 'initial' }
export type Loading = { type: 'loading' }
export type Failed<E> = { type: 'failed'; error: E }
export type Complete<T> = { type: 'complete'; data: T }

export type Datum<E, T> = Initial | Loading | Failed<E> | Complete<T>

export const initial: Initial = { type: 'initial' };
export const loading: Loading = { type: 'loading' };
export const failed = <E>(error: E): Failed<E> => ({ type: 'failed', error });
export const complete = <T>(data: T): Complete<T> => ({ type: 'complete', data });

export const isInitial = <E, T>(datum: Datum<E, T>): datum is Initial => datum.type === 'initial';
export const isLoading = <E, T>(datum: Datum<E, T>): datum is Loading => datum.type === 'loading';
export const isFailed = <E, T>(datum: Datum<E, T>): datum is Failed<E> => datum.type === 'failed';
export const isComplete = <E, T>(datum: Datum<E, T>): datum is Complete<T> => datum.type === 'complete';
