import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import classes from './App.module.css'
import { ReleasePage } from './pages/release/Release'
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
    <div className={classes.container}>
      <ReleasePage release={state} />
    </div>
  )
}
