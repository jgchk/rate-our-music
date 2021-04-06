import { isSuccess } from '../../utils/remote-data'
import { Reducer } from '../store'

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
    case 'auth/login': {
      if (!isSuccess(action.request)) return state
      const user: User = action.request.data.account.login.account
      return { ...state, [user.id]: user }
    }

    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.getOne
      const users: User[] = [
        ...response.reviews.map((review) => review.account),
        ...response.tracks.flatMap((track) =>
          track.reviews.map((review) => review.account)
        ),
      ]

      let nextState = { ...state }
      for (const user of users) {
        nextState = {
          ...nextState,
          [user.id]: user,
        }
      }

      return nextState
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
