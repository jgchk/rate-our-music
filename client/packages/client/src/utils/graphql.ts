import {
  GraphqlError,
  GraphqlResponse,
  Requester,
  getSdk,
  graphqlError,
  isErrorResponse,
} from '../generated/graphql'
import { ConnectionRefusedError, HttpError, Options, post } from './http'
import { Result, err, isErr, ok } from './result'

export type GraphqlRequestError =
  | HttpError
  | ConnectionRefusedError
  | GraphqlError

const requester: Requester<GraphqlRequestError, Options> = async <R, V>(
  doc: string,
  variables: V,
  options?: Options
): Promise<Result<GraphqlRequestError, R>> => {
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
