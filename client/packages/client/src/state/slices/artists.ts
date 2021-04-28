import { GetArtistQuery } from '../../generated/graphql'
import { GraphqlRequestError, graphql } from '../../utils/graphql'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
import { mergeIds } from '../../utils/state'
import { Reducer } from '../store'

//
// Types
//

export type ArtistsState = {
  [id: number]: Artist
}

export type Artist = {
  id: number
  name: string
}

//
// Reducer
//

export const artistsReducer: Reducer<ArtistsState> = (state, action) => {
  if (state === undefined) {
    const initialState: ArtistsState = {}
    return initialState
  }

  switch (action._type) {
    case 'artist/get': {
      if (!isSuccess(action.request)) return state
      const artist = action.request.data.artist.get
      return mergeIds(state, [artist])
    }

    case 'release/getFull': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.get
      const artists: Artist[] = response.artists

      return mergeIds(state, artists)
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.track.get
      const artists: Artist[] = response.artists

      return mergeIds(state, artists)
    }

    default:
      return state
  }
}

//
// Actions
//

export type ArtistActions = GetArtistAction

export type GetArtistAction = {
  _type: 'artist/get'
  request: RemoteData<GraphqlRequestError, GetArtistQuery>
}
export const getArtist = async function* (
  id: number
): AsyncGenerator<GetArtistAction> {
  yield { _type: 'artist/get', request: loading }
  const response = await graphql.getArtist({ id })
  yield { _type: 'artist/get', request: fromResult(response) }
}
