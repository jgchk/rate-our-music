import { left, right } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import { map } from 'fp-ts/Task'
import { TaskEither, chainW } from 'fp-ts/TaskEither'
import {
  GraphqlError,
  GraphqlResponse,
  getSdk,
  isGraphqlError,
} from '../generated/graphql'
import { HttpError, post } from './http'

const requester = <R, V>(
  doc: string,
  vars: V
): TaskEither<HttpError | GraphqlError, R> =>
  pipe(
    post('/graphql', {
      json: { query: doc, variables: vars },
    }),
    chainW(
      flow(
        (response) => () => response.json<GraphqlResponse<R>>(),
        map((gql) =>
          isGraphqlError(gql)
            ? left(new GraphqlError(gql.errors))
            : right(gql.data)
        )
      )
    )
  )

export const gql = getSdk(requester)
