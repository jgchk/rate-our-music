import { FunctionComponent, h } from 'preact'
import { useAuthRefresh } from './features/auth/hooks/useAuthRefresh'
import { Layout } from './features/common/components/Layout'
import { StateProvider } from './features/common/state/store'
import { Router, RouterProvider } from './features/routing/components/Router'

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
