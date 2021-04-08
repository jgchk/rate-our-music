import { DocumentNode } from 'graphql/language/ast'
import { print } from 'graphql/language/printer'
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
  doc: DocumentNode,
  variables: V
): Promise<Result<HttpError | GraphqlError, R>> => {
  const query = print(doc)
  const response = await post('/graphql', {
    json: { query, variables },
  })

  if (isErr(response)) return err(response.error)

  const responseData = await response.data.json<GraphqlResponse<R>>()
  if (isErrorResponse(responseData))
    return err(graphqlError(responseData.errors))

  return ok(responseData.data)
}

export const gql = getSdk(requester)
