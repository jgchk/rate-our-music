import {
  GetAllReleaseTypesQuery,
  ReleaseTypeDataFragment,
} from '../../generated/graphql'
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

export type ReleaseTypesState = {
  releaseTypes: { [id: number]: ReleaseType }
  lastFetchedAll: Date | undefined
}

export type ReleaseType = {
  id: number
  name: string
}

//
// Mappers
//

const mapReleaseType = (releaseType: ReleaseTypeDataFragment): ReleaseType => ({
  id: releaseType.id,
  name: releaseType.name,
})

//
// Reducer
//

export const releaseTypesReducer: Reducer<ReleaseTypesState> = (
  state,
  action
) => {
  if (state === undefined) {
    const initialState: ReleaseTypesState = {
      releaseTypes: {},
      lastFetchedAll: undefined,
    }
    return initialState
  }

  switch (action._type) {
    case 'releaseType/getAll': {
      if (!isSuccess(action.request)) return state
      const releaseTypes = action.request.data.releaseType.getAll.map(
        mapReleaseType
      )
      return {
        ...state,
        releaseTypes: mergeIds(state.releaseTypes, releaseTypes),
        lastFetchedAll: new Date(),
      }
    }

    default:
      return state
  }
}

//
// Actions
//

export type ReleaseTypeActions = GetAllReleaseTypesAction

export type GetAllReleaseTypesAction = {
  _type: 'releaseType/getAll'
  request: RemoteData<GraphqlRequestError, GetAllReleaseTypesQuery>
}
export const getAllReleaseTypes = async function* (): AsyncGenerator<GetAllReleaseTypesAction> {
  yield { _type: 'releaseType/getAll', request: loading }
  const response = await graphql.getAllReleaseTypes({})
  yield { _type: 'releaseType/getAll', request: fromResult(response) }
}
