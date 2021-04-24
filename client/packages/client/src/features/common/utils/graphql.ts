import {
  GraphqlError,
  GraphqlResponse,
  getSdk,
  graphqlError,
  isErrorResponse,
} from '../../../generated/graphql'
import { HttpError, post } from './http'
import { Result, err, isErr, ok } from './result'

const requester = async <R, V>(
  doc: string,
  variables: V
): Promise<Result<HttpError | GraphqlError, R>> => {
  const response = await post('/graphql', {
    json: { query: doc, variables },
  })

  if (isErr(response)) return err(response.error)

  const responseData = await response.data.json<GraphqlResponse<R>>()
  if (isErrorResponse(responseData))
    return err(graphqlError(responseData.errors))

  return ok(responseData.data)
}

export const graphql = getSdk(requester)
