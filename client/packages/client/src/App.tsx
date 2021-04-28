import { FunctionComponent, h } from 'preact'
import { Layout } from './features/common/components/Layout'
import { StateProvider } from './features/common/state/store'
import { Router, RouterProvider } from './features/routing/components/Router'

import './styles/index.css'

export const App: FunctionComponent = () => (
  <StateProvider>
    <RouterProvider>
      <Layout>
        <Router />
      </Layout>
    </RouterProvider>
  </StateProvider>
)
