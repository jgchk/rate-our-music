import { GetArtistQuery, GraphqlError } from '../../../generated/graphql'
import { Reducer } from '../../common/state/store'
import { graphql } from '../../common/utils/graphql'
import { HttpError } from '../../common/utils/http'
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
    case 'release/get': {
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
  request: RemoteData<HttpError | GraphqlError, GetArtistQuery>
}
export const getArtist = async function* (
  id: number
): AsyncGenerator<GetArtistAction> {
  yield { _type: 'artist/get', request: loading }
  const response = await graphql.getArtist({ id })
  yield { _type: 'artist/get', request: fromResult(response) }
}
