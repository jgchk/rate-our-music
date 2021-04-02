import { FunctionComponent } from 'preact'
import { Layout } from './layout/Layout'
import { ReleasePage } from './pages/release/ReleasePage'
import { StateProvider } from './state/store'

import './global.css'
import './theme.css'

export const App: FunctionComponent = () => (
  <StateProvider>
    <Layout>
      <ReleasePage />
    </Layout>
  </StateProvider>
)
