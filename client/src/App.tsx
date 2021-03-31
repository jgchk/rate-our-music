import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { Layout } from './pages/layout/Layout'
import { ReleasePage } from './pages/release/ReleasePage'
import { state } from './state'
import { gql } from './utils/gql'
import './global.css'

export const App: FunctionComponent = () => {
  useEffect(() => {
    const f = async () => {
      const r = await gql.GetRelease({ id: 0 })()
      console.log(r)
    }
    void f()
  }, [])

  return (
    <Layout>
      <ReleasePage release={state} />
    </Layout>
  )
}
