// import { devtoolsExchange } from '@urql/devtools'
import { authExchange } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache'
import {
  Client,
  createClient,
  dedupExchange,
  fetchExchange,
  makeOperation,
} from '@urql/preact'
import { AuthDataFragment, RefreshDocument } from '../generated/graphql'

export const makeClient = (): Client =>
  createClient({
    url: '/graphql',
    exchanges: [
      // devtoolsExchange,
      dedupExchange,
      cacheExchange({
        keys: {
          // eslint-disable-next-line unicorn/no-null
          AccountQuery: () => null,
        },
      }),
      authExchange<{ token: string; refreshToken: string }>({
        // eslint-disable-next-line @typescript-eslint/require-await
        getAuth: async ({ authState, mutate }) => {
          if (!authState) {
            const token = localStorage.getItem('token')
            const refreshToken = localStorage.getItem('refreshToken')
            if (token && refreshToken) {
              return {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                token: JSON.parse(token),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                refreshToken: JSON.parse(refreshToken),
              }
            }
            // eslint-disable-next-line unicorn/no-null
            return null
          }

          const result = await mutate(RefreshDocument, {
            refreshToken: authState.refreshToken,
          })

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
          const data: AuthDataFragment = result.data?.account.refresh
          if (data) {
            localStorage.setItem('token', JSON.stringify(data.token))
            localStorage.setItem(
              'refreshToken',
              JSON.stringify(data.refreshToken)
            )
            return { token: data.token, refreshToken: data.refreshToken }
          }

          // auth has gone wrong. clean up
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')

          // eslint-disable-next-line unicorn/no-null
          return null
        },
        addAuthToOperation: ({ authState, operation }) => {
          if (!authState || !authState.token) return operation
          const fetchOptions =
            typeof operation.context.fetchOptions === 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions ?? {}
          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: authState.token,
              },
            },
          })
        },
        didAuthError: ({ error }) =>
          error.graphQLErrors.some((e) => e.message === 'invalid credentials'),
      }),
      fetchExchange,
    ],
  })
