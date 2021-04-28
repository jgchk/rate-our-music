import {
  GraphqlError,
  LoginMutation,
  LogoutMutation,
} from '../../../generated/graphql'
import { Reducer } from '../../common/state/store'
import { graphql } from '../../common/utils/graphql'
import { HttpError } from '../../common/utils/http'
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
      if (isSuccess(action.request)) {
        const response = action.request.data.account.login
        return {
          ...state,
          auth: {
            token: response.token,
            user: response.account.id,
          },
        }
      } else {
        return state
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

    default:
      return state
  }
}

//
// Actions
//

export type AuthActions = LoginAction | LogoutAction

export type LoginAction = {
  _type: 'auth/login'
  request: RemoteData<HttpError | GraphqlError, LoginMutation>
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
  request: RemoteData<HttpError | GraphqlError, LogoutMutation>
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
