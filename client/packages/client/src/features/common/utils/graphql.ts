import {
  GraphqlError,
  GraphqlResponse,
  Requester,
  getSdk,
  graphqlError,
  isErrorResponse,
} from '../../../generated/graphql'
import { HttpError, Options, post } from './http'
import { Result, err, isErr, ok } from './result'

const requester: Requester<Options> = async <R, V>(
  doc: string,
  variables: V,
  options?: Options
): Promise<Result<HttpError | GraphqlError, R>> => {
  const response = await post('/graphql', {
    json: { query: doc, variables },
    ...options,
  })

  if (isErr(response)) return err(response.error)

  const responseData = await response.data.json<GraphqlResponse<R>>()
  if (isErrorResponse(responseData))
    return err(graphqlError(responseData.errors))

  return ok(responseData.data)
}

export const graphql = getSdk(requester)
