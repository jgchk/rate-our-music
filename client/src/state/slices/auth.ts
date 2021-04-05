import { isLeft } from 'fp-ts/Either'
import { GraphqlError, LoginMutation } from '../../generated/graphql'
import { gql } from '../../utils/gql'
import { HttpError } from '../../utils/http'
import {
  RemoteData,
  failure,
  initial,
  isSuccess,
  loading,
  success,
} from '../../utils/remote-data'
import { Reducer } from '../store'

//
// Types
//

export type AuthState = {
  auth: Auth | undefined
  requests: {
    login: RemoteData<HttpError | GraphqlError, LoginMutation>
  }
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
    const initialState: AuthState = {
      auth: undefined,
      requests: {
        login: initial,
      },
    }
    return initialState
  }

  switch (action._type) {
    case 'auth/login': {
      const newState: AuthState = {
        ...state,
        requests: {
          ...state.requests,
          login: action.request,
        },
      }

      if (isSuccess(action.request)) {
        const response = action.request.data.account.login
        newState.auth = {
          ...newState.auth,
          token: response.token,
          user: response.account.id,
        }
      }

      return newState
    }

    default:
      return state
  }
}

//
// Actions
//

export type AuthActions = LoginAction

export type LoginAction = {
  _type: 'auth/login'
  request: RemoteData<HttpError | GraphqlError, LoginMutation>
}
export const login = async function* (
  username: string,
  password: string
): AsyncGenerator<LoginAction> {
  yield { _type: 'auth/login', request: loading }
  const response = await gql.Login({ username, password })()
  yield isLeft(response)
    ? {
        _type: 'auth/login',
        request: failure(response.left),
      }
    : {
        _type: 'auth/login',
        request: success(response.right),
      }
}
