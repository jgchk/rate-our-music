import {
  LoginMutation,
  LogoutMutation,
  RefreshMutation,
} from '../../../generated/graphql'
import { Reducer } from '../../common/state/store'
import { GraphqlRequestError, graphql } from '../../common/utils/graphql'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../common/utils/remote-data'

//
// Types
//

export type AuthState = {
  auth: Auth | undefined
}

export type Auth = {
  token: string
  user: number
}

//
// Reducer
//

export const authReducer: Reducer<AuthState> = (state, action) => {
  if (state === undefined) {
    const initialState: AuthState = { auth: undefined }
    return initialState
  }

  switch (action._type) {
    case 'auth/login': {
      if (!isSuccess(action.request)) return state
      const response = action.request.data.account.login
      return {
        ...state,
        auth: {
          token: response.token,
          user: response.account.id,
        },
      }
    }

    case 'auth/logout': {
      return isSuccess(action.request)
        ? {
            ...state,
            auth: undefined,
          }
        : state
    }

    case 'auth/refresh': {
      if (!isSuccess(action.request)) return state
      const response = action.request.data.account.refresh
      return {
        ...state,
        auth: {
          token: response.token,
          user: response.account.id,
        },
      }
    }

    default:
      return state
  }
}

//
// Actions
//

export type AuthActions = LoginAction | LogoutAction | RefreshAction

export type LoginAction = {
  _type: 'auth/login'
  request: RemoteData<GraphqlRequestError, LoginMutation>
}
export const login = async function* (
  username: string,
  password: string
): AsyncGenerator<LoginAction> {
  yield { _type: 'auth/login', request: loading }
  const response = await graphql.login({ username, password })
  yield { _type: 'auth/login', request: fromResult(response) }
}

export type LogoutAction = {
  _type: 'auth/logout'
  request: RemoteData<GraphqlRequestError, LogoutMutation>
}
export const logout = async function* (
  token: string,
  force?: boolean
): AsyncGenerator<LogoutAction> {
  yield { _type: 'auth/logout', request: loading }
  const response = await graphql.logout(
    { force: !!force },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  yield { _type: 'auth/logout', request: fromResult(response) }
}

export type RefreshAction = {
  _type: 'auth/refresh'
  request: RemoteData<GraphqlRequestError, RefreshMutation>
}
export const refresh = async function* (): AsyncGenerator<RefreshAction> {
  yield { _type: 'auth/refresh', request: loading }
  const response = await graphql.refresh({})
  yield { _type: 'auth/refresh', request: fromResult(response) }
}
