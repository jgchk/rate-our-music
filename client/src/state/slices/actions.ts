import { DispatchedAction, Reducer } from '../store'

//
// Types
//

export type ActionsState = {
  [id: number]: DispatchedAction
}

//
// Reducer
//

export const actionsReducer: Reducer<ActionsState> = (state, action) => {
  if (state === undefined) {
    const initialState: ActionsState = {}
    return initialState
  }

  return { ...state, [action.id]: action }
}
