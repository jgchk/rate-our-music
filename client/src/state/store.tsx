import { FunctionComponent, createContext } from 'preact'
import { useCallback, useContext, useMemo, useReducer } from 'preact/hooks'
import {
  GetReleaseAction,
  ReleaseState,
  initialReleaseState,
  releaseReducer,
} from './release'

export type State = {
  release: ReleaseState
}

export type Action = GetReleaseAction

const isAction = (action: Action | Generator<Action>): action is Action =>
  '_type' in action

export type Dispatch = (action: Action | Generator<Action>) => void

const initialState: State = {
  release: initialReleaseState,
}

const reducer = (state: State, action: Action): State => ({
  release: releaseReducer(state, action),
})

const Store = createContext<{ state: State; dispatch: Dispatch }>({
  state: initialState,
  dispatch: () => {
    throw new Error('dispatch is not available yet!')
  },
})

export const StateProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const wrappedDispatch: Dispatch = useCallback((action) => {
    if (isAction(action)) {
      dispatch(action)
    } else {
      for (const a of action) {
        dispatch(a)
      }
    }
  }, [])

  return (
    <Store.Provider value={{ state, dispatch: wrappedDispatch }}>
      {children}
    </Store.Provider>
  )
}

export const useSelector = <T,>(selector: (state: State) => T): T => {
  const { state } = useContext(Store)
  const value = useMemo(() => selector(state), [selector, state])
  return value
}

export const useDispatch = (): Dispatch => {
  const { dispatch } = useContext(Store)
  return dispatch
}
