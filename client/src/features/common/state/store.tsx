import { FunctionComponent, createContext, h } from 'preact'
import { useCallback, useContext, useMemo, useReducer } from 'preact/hooks'
import { RootAction, RootState, appReducer } from './root'

export type State = RootState
export type Action = RootAction

export type DispatchedAction<A extends Action = Action> = A & {
  id: number
}
export type ActionGenerator<A extends Action> =
  | A
  | Generator<A>
  | AsyncGenerator<A>
export type ActionCreator<Args extends unknown[], Act extends Action> = (
  ...args: Args
) => ActionGenerator<Act>

export type Reducer<S> = (state: S | undefined, action: DispatchedAction) => S

const isRawAction = (action: ActionGenerator<Action>): action is Action =>
  '_type' in action

export type Dispatch = (action: ActionGenerator<Action>) => number

export const reducer: Reducer<State> = (state, action) => {
  const newState = appReducer(state, action)
  console.log({ action, state: newState })
  return newState
}

let currActionId = 0

export type InitAction = { _type: 'init' }
const initAction: InitAction = { _type: 'init' }
const initialState = reducer(undefined, { ...initAction, id: currActionId++ })

const Store = createContext<{ state: State; dispatch: Dispatch }>({
  state: initialState,
  dispatch: () => {
    throw new Error('Store must be used inside StateProvider')
  },
})

export const StateProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const dispatcher = useCallback(
    async (
      action: Action | Generator<Action> | AsyncGenerator<Action>,
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

export const useSelector = <T,>(selector: (state: State) => T): T => {
  const { state } = useContext(Store)
  const value = useMemo(() => selector(state), [selector, state])
  return value
}

export const useDispatch = (): Dispatch => {
  const { dispatch } = useContext(Store)
  return dispatch
}
