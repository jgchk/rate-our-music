import { FunctionComponent } from 'preact'
import styles from './App.module.css'
import './global.css'

export const App: FunctionComponent = () => (
  <div className={styles.container}>
    <div className={styles.text}>Hello, world!</div>
  </div>
)
