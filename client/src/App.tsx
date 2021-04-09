import { FunctionComponent, h } from 'preact'
import { Layout } from './features/common/components/Layout'
import { StateProvider } from './features/common/state/store'
import { Router } from './features/routing/components/Router'

import './features/common/styles/global.css'
import './features/common/styles/theme.css'

export const App: FunctionComponent = () => (
  <StateProvider>
    <Layout>
      <Router />
    </Layout>
  </StateProvider>
)
