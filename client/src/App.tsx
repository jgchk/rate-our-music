import { FunctionComponent } from 'preact'
import { Layout } from './layout/Layout'
import { Router } from './router/Router'
import { StateProvider } from './state/store'

import './global.css'
import './theme.css'

export const App: FunctionComponent = () => (
  <StateProvider>
    <Layout>
      <Router />
    </Layout>
  </StateProvider>
)
