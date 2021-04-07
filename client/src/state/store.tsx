import odiff from 'odiff'
import { FunctionComponent, createContext } from 'preact'
import { useCallback, useContext, useMemo, useReducer } from 'preact/hooks'
import { AppState, appReducer } from './app'
import { ArtistActions } from './slices/artists'
import { AuthActions } from './slices/auth'
import { GenreActions } from './slices/genres'
import { ReleaseReviewActions } from './slices/release-reviews'
import { ReleaseActions } from './slices/releases'
import { TrackReviewActions } from './slices/track-reviews'
import { TrackActions } from './slices/tracks'
import { UserActions } from './slices/users'

export type RootState = AppState

export type RawAction =
  | InitAction
  | AuthActions
  | ReleaseActions
  | TrackActions
  | ReleaseReviewActions
  | TrackReviewActions
  | ArtistActions
  | GenreActions
  | UserActions

export type DispatchedAction<A extends RawAction = RawAction> = A & {
  id: number
}
export type Action<A extends RawAction> = A | Generator<A> | AsyncGenerator<A>
export type ActionCreator<Args extends unknown[], Act extends RawAction> = (
  ...args: Args
) => Action<Act>

export type Reducer<S> = (state: S | undefined, action: DispatchedAction) => S

const isRawAction = (action: Action<RawAction>): action is RawAction =>
  '_type' in action

export type Dispatch = (action: Action<RawAction>) => number

export const reducer: Reducer<RootState> = (state, action) => {
  const newState = appReducer(state, action)
  console.log({ action, state: newState, diff: odiff(state, newState) })
  return newState
}

let currActionId = 0

export type InitAction = { _type: 'init' }
const initAction: InitAction = { _type: 'init' }
const initialState = reducer(undefined, { ...initAction, id: currActionId++ })

const Store = createContext<{ state: RootState; dispatch: Dispatch }>({
  state: initialState,
  dispatch: () => {
    throw new Error('Store must be used inside StateProvider')
  },
})

export const StateProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const dispatcher = useCallback(
    async (
      action: RawAction | Generator<RawAction> | AsyncGenerator<RawAction>,
      id: number
    ) => {
      if (isRawAction(action)) {
        dispatch({ ...action, id })
      } else {
        for await (const subAction of action) {
          dispatch({ ...subAction, id })
        }
      }
    },
    []
  )

  const dispatchWithId: Dispatch = useCallback(
    (action) => {
      const id = currActionId++
      void dispatcher(action, id)
      return id
    },
    [dispatcher]
  )

  return (
    <Store.Provider value={{ state, dispatch: dispatchWithId }}>
      {children}
    </Store.Provider>
  )
}

export const useSelector = <T,>(selector: (state: RootState) => T): T => {
  const { state } = useContext(Store)
  const value = useMemo(() => selector(state), [selector, state])
  return value
}

export const useDispatch = (): Dispatch => {
  const { dispatch } = useContext(Store)
  return dispatch
}
