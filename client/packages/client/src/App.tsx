import { FunctionComponent, h } from 'preact'
import { Layout } from './components/Layout'
import { useAuthRefresh } from './hooks/useAuthRefresh'
import { Router } from './router/Router'
import { RouterProvider } from './router/useRouterContext'
import { StateProvider } from './state/store'

import './styles/index.css'

const StatefulApp: FunctionComponent = () => {
  useAuthRefresh()

  return (
    <RouterProvider>
      <Layout>
        <Router />
      </Layout>
    </RouterProvider>
  )
}

export const App: FunctionComponent = () => (
  <StateProvider>
    <StatefulApp />
  </StateProvider>
)
