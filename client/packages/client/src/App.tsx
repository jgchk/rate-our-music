import { Provider } from '@urql/preact'
import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { Layout } from './components/Layout'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Router } from './router/Router'
import { RouterProvider } from './router/useRouterContext'
import { makeClient } from './state/urql'

import './styles/index.css'

export const App: FunctionComponent = () => {
  const [token] = useLocalStorage<string | undefined>('token', undefined)

  // recreate the gql client every time our token (login state) changes
  const client = useMemo(
    () => makeClient(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  )

  return (
    <Provider value={client}>
      <RouterProvider>
        <Layout>
          <Router />
        </Layout>
      </RouterProvider>
    </Provider>
  )
}
