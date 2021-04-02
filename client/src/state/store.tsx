import { FunctionComponent, createContext } from 'preact'
import { useCallback, useContext, useMemo, useReducer } from 'preact/hooks'
import {
  ReleaseActions,
  ReleasePageState,
  initialReleaseState,
  releaseReducer,
} from './slices/release-page'

export type State = {
  releasePage: ReleasePageState
}

export type Action = ReleaseActions

const isAction = (
  action: Action | Generator<Action> | AsyncGenerator<Action>
): action is Action => '_type' in action

export type Dispatch = (
  action: Action | Generator<Action> | AsyncGenerator<Action>
) => void

const initialState: State = {
  releasePage: initialReleaseState,
}

const reducer = (state: State, action: Action): State => ({
  releasePage: releaseReducer(state, action),
})

const Store = createContext<{ state: State; dispatch: Dispatch }>({
  state: initialState,
  dispatch: () => {
    throw new Error('dispatch is not available yet!')
  },
})

export const StateProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const wrappedDispatch: Dispatch = useCallback(async (action) => {
    if (isAction(action)) {
      console.log({ action })
      dispatch(action)
    } else {
      for await (const subAction of action) {
        console.log({ action: subAction })
        dispatch(subAction)
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
