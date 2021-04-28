import { GetUserQuery } from '../../../generated/graphql'
import { Reducer } from '../../common/state/store'
import { GraphqlRequestError, graphql } from '../../common/utils/graphql'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../common/utils/remote-data'
import { mergeIds } from '../../common/utils/state'

//
// Types
//

export type UsersState = {
  [id: number]: User
}

export type User = {
  id: number
  username: string
}

//
// Reducer
//

export const usersReducer: Reducer<UsersState> = (state, action) => {
  if (state === undefined) {
    const initialState: UsersState = {}
    return initialState
  }

  switch (action._type) {
    case 'user/get': {
      if (!isSuccess(action.request)) return state
      const user: User = action.request.data.account.get
      return { ...state, [user.id]: user }
    }

    case 'auth/login': {
      if (!isSuccess(action.request)) return state
      const user: User = action.request.data.account.login.account
      return { ...state, [user.id]: user }
    }

    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.get
      const users: User[] = response.reviews.map((review) => review.account)
      return mergeIds(state, users)
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.track.get
      const users: User[] = response.reviews.map((review) => review.account)
      return mergeIds(state, users)
    }

    case 'review/release/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.create
      const user: User = response.account
      return { ...state, [user.id]: user }
    }
    case 'review/release/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.updateRating
      const user: User = response.account
      return { ...state, [user.id]: user }
    }
    case 'review/track/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.trackReview.create
      const user: User = response.account
      return { ...state, [user.id]: user }
    }
    case 'review/track/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.trackReview.updateRating
      const user: User = response.account
      return { ...state, [user.id]: user }
    }

    default:
      return state
  }
}

//
// Actions
//

export type UserActions = GetUserAction

export type GetUserAction = {
  _type: 'user/get'
  request: RemoteData<GraphqlRequestError, GetUserQuery>
}
export const getUser = async function* (
  id: number
): AsyncGenerator<GetUserAction> {
  const base = { _type: 'user/get' } as const
  yield { ...base, request: loading }
  const response = await graphql.getUser({ id })
  yield { ...base, request: fromResult(response) }
}
