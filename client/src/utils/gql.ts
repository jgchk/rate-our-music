import { Either, isLeft, left, right } from 'fp-ts/Either'
import {
  GraphqlError,
  GraphqlResponse,
  getSdk,
  graphqlError,
  isErrorResponse,
} from '../generated/graphql'
import { HttpError, post } from './http'

const requester = async <R, V>(
  doc: string,
  vars: V
): Promise<Either<HttpError | GraphqlError, R>> => {
  const response = await post('/graphql', {
    json: { query: doc, variables: vars },
  })

  if (isLeft(response)) return left(response.left)

  const responseData = await response.right.json<GraphqlResponse<R>>()
  if (isErrorResponse(responseData))
    return left(graphqlError(responseData.errors))

  return right(responseData.data)
}

export const gql = getSdk(requester)
